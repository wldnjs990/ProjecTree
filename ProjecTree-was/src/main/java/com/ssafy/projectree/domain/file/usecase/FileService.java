package com.ssafy.projectree.domain.file.usecase;

import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.file.model.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;

    public List<FileReadDto.Response> upload(List<MultipartFile> multipartFiles) {
        List<FileReadDto.Response> result = new ArrayList<>();

        // TODO: 파일명 생성 후 S3 업로드 로직 구현
        return result;
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
        // TODO: File명 생성 로직 구현
        String savedFileName = "";
        return savedFileName;
    }
}
