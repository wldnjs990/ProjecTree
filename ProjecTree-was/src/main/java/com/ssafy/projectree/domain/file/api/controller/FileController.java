package com.ssafy.projectree.domain.file.api.controller;

import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.file.api.dto.FileUploadDto;
import com.ssafy.projectree.domain.file.usecase.S3FileService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {

    // TODO: AWS S3 설정 후 세부 로직 구현 필요
    private final S3FileService fileService;

    @PostMapping("/workspaces/{id}")
    public CommonResponse<FileUploadDto.Response> upload(List<MultipartFile> multipartFiles, @PathVariable Long id) throws IOException {
        return CommonResponse.success(SuccessCode.SUCCESS, fileService.upload(multipartFiles, id));
    }

    @GetMapping("/workspaces/{id}")
    public CommonResponse<List<FileReadDto.Response>> read(@PathVariable Long id) {
        return CommonResponse.success(SuccessCode.SUCCESS, fileService.read(id));
    }

}
