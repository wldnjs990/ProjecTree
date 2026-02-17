package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.member.api.dto.MemberDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.api.dto.TeamDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Team", description = "워크 스페이스 팀 관련 API")
public interface TeamDocsController {

    @Operation(
            summary = "역할 변경",
            description = "해당 워크 스페이스에 소속된 팀원의 역할을 수정합니다. (OWNER, VIEWER, EDITOR)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Successfully Created"),
            @ApiResponse(responseCode = "403", description = "권한 변경이 거부되었습니다. - 권한 없음")
    })
    CommonResponse<?> updateMemberRole(@AuthenticationPrincipal Member member, @RequestBody TeamDto.UpdateRoleRequest dto);

    @Operation(summary = "워크 스페이스 멤버 초대 API", description = "이메일 전송을 통해 워크 스페이스에 팀원을 초대합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MemberDto.Info.class)
                    )
            ),
            @ApiResponse(responseCode = "401", description = "만료된 토큰입니다.")
    })
    CommonResponse<?> invite(@AuthenticationPrincipal Member member, @RequestBody TeamDto.Invite dto);
}
