package com.ssafy.projectree.domain.workspace.api.controller;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.domain.workspace.usecase.WorkspaceService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.WorkspaceDocsController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/workspaces")
public class WorkspaceController implements WorkspaceDocsController {

    private final WorkspaceService workspaceService;

    @Override
    public CommonResponse<List<WorkspaceDto.Response>> getMyWorkspaces(@AuthenticationPrincipal Member member) {
        return CommonResponse.success(SuccessCode.SUCCESS, workspaceService.read(member));
    }

    @Override
    public CommonResponse<String> create(
            @AuthenticationPrincipal Member member,
            @RequestPart(value = "data") WorkspaceDto.Insert dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> multipartFiles
    ) throws IOException {
        workspaceService.create(member, dto, multipartFiles);
        return CommonResponse.success(SuccessCode.SUCCESS, "워크 스페이스 생성에 성공하였습니다.");
    }

    @Override
    public CommonResponse<?> update(@AuthenticationPrincipal Member member,
                                    @RequestPart(value = "data") WorkspaceDto.Insert dto,
                                    @RequestPart(value = "files", required = false) List<MultipartFile> multipartFiles
    ) throws IOException {
        return null;
    }

    @Override
    public CommonResponse<?> details(Member member, Long workspaceId) {
        return null;
    }
}
