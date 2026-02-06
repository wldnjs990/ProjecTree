package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
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
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/workspaces")
@Tag(name = "Workspace", description = "워크 스페이스 관련 API")
public interface WorkspaceDocsController {

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
    @GetMapping("/my")
    CommonResponse<List<WorkspaceDto.Response>> getMyWorkspaces(Member member);

    @Operation(summary = "워크 스페이스 생성 API", description = "워크 스페이스를 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully Completed"),
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    CommonResponse<?> create(Member member,
                             @RequestPart(value = "data") WorkspaceDto.Insert dto,
                             @RequestPart(value = "files", required = false) List<MultipartFile> multipartFiles
    ) throws IOException;

    @Operation(summary = "워크 스페이스 수정 API", description = "워크 스페이스 정보를 수정합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(schema = @Schema(implementation = WorkspaceDto.UpdateResponse.class))
            ),
    })
    @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    CommonResponse<?> update(Member member, WorkspaceDto.UpdateRequest dto, List<MultipartFile> multipartFiles) throws IOException;

    @Operation(summary = "워크 스페이스 상세조회 API", description = "워크 스페이스 진입 시 보여주는 정보입니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WorkspaceDto.Detail.class)
                    )),
    })
    @GetMapping()
    CommonResponse<?> details(Member member, Long workspaceId);

    @Operation(summary = "워크 스페이스 파일 조회 API", description = "워크 스페이스 내에 업로드된 파일들을 페이징 처리하여 조회합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = FileReadDto.Response.class)
                    )),
    })
    @GetMapping("/{workspace-id}/files")
    CommonResponse<Page<FileReadDto.Response>> getWorkspaceFiles(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @PathVariable(name = "workspace-id") Long workspaceId);

    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WorkspaceDto.Info.class)
                    )),
    })
    @Operation(summary = "워크 스페이스 정보 조회 API", description = "설정 탭에서 보여줄 워크 스페이스 정보")
    @GetMapping("/{workspace-id}/settings")
    CommonResponse<?> getWorkspaceInfo(@AuthenticationPrincipal Member member, @PathVariable(name = "workspace-id") Long id);
}
