package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.member.api.dto.MemberDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.api.dto.TeamDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Team", description = "워크스페이스 팀 관련 API")
public interface TeamDocsController {

    @Operation(
            summary = "팀원 역할 변경",
            description = "해당 워크스페이스에 소속된 팀원의 역할을 수정합니다. 역할은 OWNER, EDITOR, VIEWER 중 하나입니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully Completed"),
            @ApiResponse(responseCode = "403", description = "권한 없음 - 역할 변경이 거부되었습니다.")
    })
    @PatchMapping
    CommonResponse<?> updateMemberRole(
            @Parameter(hidden = true) @AuthenticationPrincipal Member member,
            @RequestBody TeamDto.UpdateRoleRequest dto);

    @Operation(
            summary = "워크스페이스 팀원 초대",
            description = "이메일 전송을 통해 워크스페이스에 팀원을 초대합니다. 초대 시 역할(OWNER/EDITOR/VIEWER)을 함께 지정합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MemberDto.Info.class)
                    )
            ),
            @ApiResponse(responseCode = "401", description = "만료된 토큰입니다.")
    })
    @PostMapping("/invite")
    CommonResponse<?> invite(
            @Parameter(hidden = true) @AuthenticationPrincipal Member member,
            @RequestBody TeamDto.Invite dto);
}
