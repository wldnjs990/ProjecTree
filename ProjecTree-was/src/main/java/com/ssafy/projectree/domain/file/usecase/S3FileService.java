package com.ssafy.projectree.domain.file.usecase;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.file.api.dto.FileUploadDto;
import com.ssafy.projectree.domain.file.model.entity.FileProperty;
import com.ssafy.projectree.domain.file.model.repository.FileRepository;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.usecase.WorkspaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3FileService {

    private final AmazonS3 amazonS3Client;
    private final FileRepository fileRepository;
    private final WorkspaceService workspaceService;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    public FileUploadDto.Response upload(List<MultipartFile> multipartFiles, Long workspaceId) throws IOException {

        List<String> uploadedUrls = new ArrayList<>();
        Workspace workspace = workspaceService.findById(workspaceId);

        for (MultipartFile multipartFile : multipartFiles) {

            String savedFileName = createFileName(multipartFile.getOriginalFilename());
            String path = "workspace/" + workspaceId + "/" + savedFileName;

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(multipartFile.getSize());
            metadata.setContentType(multipartFile.getContentType());

            InputStream inputStream = multipartFile.getInputStream();
            amazonS3Client.putObject(new PutObjectRequest(bucket, path, inputStream, metadata));

            String fileUrl = amazonS3Client.getUrl(bucket, path).toString();

            uploadedUrls.add(fileUrl);

            FileProperty file = FileProperty.builder()
                    .workspace(workspace)
                    .path(fileUrl)
                    .contentType(multipartFile.getContentType())
                    .originFileName(multipartFile.getOriginalFilename())
                    .savedFileName(savedFileName)
                    .size(multipartFile.getSize())
                    .build();

            fileRepository.save(file);

        }
        return FileUploadDto.Response.of("파일 업로드에 성공하였습니다.");
    }

    public List<FileReadDto.Response> read(Long id) {
        return fileRepository.getFilesByWorkspaceId(id)
                .stream()
                .map(file -> FileReadDto.Response.builder()
                        .id(file.getId())
                        .orginFileName(file.getOriginFileName())
                        .contentType(file.getContentType())
                        .path(file.getPath())
                        .size(file.getSize())
                        .build())
                .toList();
    }

    private String createFileName(String originFileName) {
        String ext = originFileName.substring(originFileName.lastIndexOf("."));
        return System.currentTimeMillis() + "_" + UUID.randomUUID() + ext;
    }
}
