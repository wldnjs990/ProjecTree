package com.ssafy.projectree.domain.workspace.api.controller;

import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.domain.workspace.usecase.WorkspaceService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.WorkspaceDocsController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class WorkspaceController implements WorkspaceDocsController {

    private final WorkspaceService workspaceService;

    public CommonResponse<List<WorkspaceDto.Response>> getMyWorkspaces(Long id) {

        return CommonResponse.success(SuccessCode.SUCCESS, workspaceService.read());
    }

}
