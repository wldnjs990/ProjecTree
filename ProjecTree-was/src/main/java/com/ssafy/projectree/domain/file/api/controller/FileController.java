package com.ssafy.projectree.domain.file.api.controller;

import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.file.usecase.FileService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {

    // TODO: AWS S3 설정 후 세부 로직 구현 필요
    private final FileService fileService;

    @PostMapping
    public CommonResponse<List<FileReadDto.Response>> upload(List<MultipartFile> multipartFiles) {
        return CommonResponse.success(SuccessCode.SUCCESS, fileService.upload(multipartFiles));
    }

    @GetMapping("/workspace/{id}")
    public CommonResponse<List<FileReadDto.Response>> read(@PathVariable Long id) {
        return CommonResponse.success(SuccessCode.SUCCESS, fileService.read(id));
    }

}
