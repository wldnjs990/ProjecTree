package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspaces")
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
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WorkspaceDto.Response.class),
                            examples = @ExampleObject(
                                    name = "(워크 스페이스 라운지 내) 워크 스페이스 조회 API 응답 예시",
                                    value = """
                                            {
                                              "workspaceId": 1,
                                              "name": "프로젝트A",
                                              "description": "설명...",
                                              "totalNodes": 45,
                                              "totalCompletedNodes": 22,
                                              "totalMembers": 5,
                                              "role": "OWNER",
                                              "progress": {
                                                "p0": {
                                                  "total": 10,
                                                  "completed": 7
                                                },
                                                "p1": {
                                                  "total": 15,
                                                  "completed": 10
                                                },
                                                "p2": {
                                                  "total": 20,
                                                  "completed": 5
                                                }
                                              },
                                              "updatedAt": "2024-01-22T16:30:00"
                                            }
                                            """
                            )
                    )
            )
    })
    @GetMapping("/{id}/my")
    CommonResponse<List<WorkspaceDto.Response>> getMyWorkspaces(@PathVariable Long id);

    @Operation(summary = "워크 스페이스 생성 API", description = "워크 스페이스를 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "워크 스페이스 생성에 성공하였습니다."),
            @ApiResponse(responseCode = "400", description = "워크 스페이스 생성에 실패하였습니다.")
    })
    @PostMapping
    CommonResponse<?> create(Member member, WorkspaceDto.Insert dto);

}
