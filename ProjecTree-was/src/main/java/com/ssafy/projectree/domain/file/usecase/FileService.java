package com.ssafy.projectree.domain.file.usecase;

import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.file.api.dto.FileUploadDto;
import com.ssafy.projectree.domain.file.model.entity.FileProperty;
import com.ssafy.projectree.domain.file.model.repository.FileRepository;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.usecase.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final S3Service s3Service;
    private final FileRepository fileRepository;

    public FileUploadDto.Response upload(List<MultipartFile> files, Workspace workspace) throws IOException {
        return uploadFiles(files, workspace);
    }

    public FileUploadDto.Response uploadFiles(List<MultipartFile> files, Workspace workspace) throws IOException {

        for (MultipartFile file : files) {
            String savedFileName = createFileName(file.getOriginalFilename());
            String url = s3Service.uploadFile(file, workspace.getId(), savedFileName);

            fileRepository.save(FileProperty.builder()
                    .workspace(workspace)
                    .path(url)
                    .contentType(file.getContentType())
                    .originFileName(file.getOriginalFilename())
                    .savedFileName(savedFileName)
                    .size(file.getSize())
                    .build()
            );

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
