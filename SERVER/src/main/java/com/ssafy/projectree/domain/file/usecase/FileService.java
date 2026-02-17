package com.ssafy.projectree.domain.file.usecase;

import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.file.api.dto.FileUploadDto;
import com.ssafy.projectree.domain.file.model.entity.FileProperty;
import com.ssafy.projectree.domain.file.model.repository.FileRepository;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final S3Service s3Service;
    private final FileRepository fileRepository;


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

    public List<FileReadDto.Response> findByWorkspaceId(Workspace workspace) {
        return fileRepository.getFilesByWorkspace(workspace)
                .stream()
                .map(file -> FileReadDto.Response.builder()
                        .id(file.getId())
                        .originFileName(file.getOriginFileName())
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

    @Transactional
    public void deleteFile(Long id) {
        FileProperty file = fileRepository.findById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.FILE_NOT_FOUND));

        // S3 삭제 후 DB 삭제
        s3Service.delete(file.getWorkspace().getId(), file.getSavedFileName());
        fileRepository.delete(file);
    }
}
