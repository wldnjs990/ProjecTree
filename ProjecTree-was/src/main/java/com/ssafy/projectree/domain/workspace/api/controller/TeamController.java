package com.ssafy.projectree.domain.workspace.api.controller;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.api.dto.TeamDto;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.usecase.TeamService;
import com.ssafy.projectree.domain.workspace.usecase.WorkspaceService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.TeamDocsController;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
public class TeamController implements TeamDocsController {

    private final WorkspaceService workspaceService;
    private final TeamService teamService;

    @PatchMapping()
    public CommonResponse<?> updateMemberRole(@AuthenticationPrincipal Member member, @RequestBody TeamDto.UpdateRoleRequest dto) {
        Workspace workspace = workspaceService.findById(dto.getWorkspaceId());
        return CommonResponse.success(SuccessCode.SUCCESS, teamService.changeRole(member, workspace, dto));
    }

}
