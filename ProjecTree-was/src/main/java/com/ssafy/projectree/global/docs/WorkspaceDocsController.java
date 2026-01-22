package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
@Tag(name = "Workspace", description = "워크 스페이스 관련 API")
public interface WorkspaceDocsController {

    // TODO: 인증/인가 구현 시 /my 만 남기고 모두 지움, 매개변수 지움
    @Operation(
            summary = "사용자가 소속된 모든 워크 스페이스 조회",
            description = "회원 ID를 통해 해당 회원이 소속된 워크 스페이스를 조회합니다. - 워크스페이스 라운지 조회용"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content
            )
    })
    @GetMapping("/{id}/my")
    CommonResponse<List<WorkspaceDto.Response>> getMyWorkspaces(@PathVariable Long id);
}
