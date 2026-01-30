package com.ssafy.projectree.domain.file.api.controller;

import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.file.api.dto.FileUploadDto;
import com.ssafy.projectree.domain.file.usecase.FileService;
import com.ssafy.projectree.domain.workspace.usecase.WorkspaceService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.FileDocsController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController implements FileDocsController {

    private final FileService fileService;
    private final WorkspaceService workspaceService;

    @PostMapping("/workspaces/{id}")
    public CommonResponse<FileUploadDto.Response> upload(@RequestPart(value = "files", required = true) List<MultipartFile> multipartFiles, @PathVariable Long id) throws IOException {
        return CommonResponse.success(SuccessCode.SUCCESS, fileService.uploadFiles(multipartFiles, workspaceService.findById(id)));
    }

}
