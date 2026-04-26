package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@Tag(name = "Workspace", description = "워크스페이스 관련 API")
public interface WorkspaceDocsController {

    @Operation(
            summary = "내 워크스페이스 목록 조회",
            description = "로그인한 사용자가 소속된 모든 워크스페이스를 조회합니다. (워크스페이스 라운지 화면용)"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WorkspaceDto.Response.class),
                            examples = @ExampleObject(
                                    name = "워크스페이스 목록 응답 예시",
                                    value = """
                                            {
                                              "workspaceId": 1,
                                              "name": "프로젝트A",
                                              "description": "설명...",
                                              "totalMembers": 5,
                                              "role": "OWNER",
                                              "progress": {
                                                "p0": { "total": 10, "completed": 7 },
                                                "p1": { "total": 15, "completed": 10 },
                                                "p2": { "total": 20, "completed": 5 }
                                              },
                                              "updatedAt": "2024-01-22T16:30:00"
                                            }
                                            """
                            )
                    )
            )
    })
    @GetMapping("/my")
    CommonResponse<List<WorkspaceDto.Response>> getMyWorkspaces(
            @Parameter(hidden = true) @AuthenticationPrincipal Member member);

    @Operation(
            summary = "워크스페이스 생성",
            description = "새로운 워크스페이스를 생성합니다. 생성 정보는 JSON 형식의 `data` 파트로, 첨부 파일은 `files` 파트로 전송합니다. (Content-Type: multipart/form-data)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully Completed"),
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    CommonResponse<String> create(
            @Parameter(hidden = true) @AuthenticationPrincipal Member member,
            @Parameter(name = "data", description = "워크스페이스 생성 정보 (JSON 형식)",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = WorkspaceDto.Insert.class)))
            @RequestPart(value = "data") WorkspaceDto.Insert dto,
            @Parameter(name = "files", description = "첨부 파일 목록 (선택)")
            @RequestPart(value = "files", required = false) List<MultipartFile> multipartFiles
    ) throws IOException;

    @Operation(
            summary = "워크스페이스 수정",
            description = "워크스페이스 정보를 수정합니다. 수정 정보는 JSON 형식의 `data` 파트로, 새 첨부 파일은 `files` 파트로 전송합니다. (Content-Type: multipart/form-data)"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WorkspaceDto.UpdateResponse.class)
                    )
            ),
    })
    @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    CommonResponse<?> update(
            @Parameter(hidden = true) @AuthenticationPrincipal Member member,
            @Parameter(name = "data", description = "워크스페이스 수정 정보 (JSON 형식)",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = WorkspaceDto.UpdateRequest.class)))
            @RequestPart(value = "data") WorkspaceDto.UpdateRequest dto,
            @Parameter(name = "files", description = "새로 첨부할 파일 목록 (선택)")
            @RequestPart(value = "files", required = false) List<MultipartFile> multipartFiles
    ) throws IOException;

    @Operation(
            summary = "워크스페이스 상세 조회",
            description = "워크스페이스 진입 시 필요한 전체 정보(기본 정보 + 노드 트리 + 파일 목록 + 팀 정보)를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WorkspaceDto.Detail.class)
                    )),
    })
    @GetMapping
    CommonResponse<?> details(
            @Parameter(hidden = true) @AuthenticationPrincipal Member member,
            @Parameter(description = "워크스페이스 ID", example = "1")
            @RequestParam Long workspaceId);

    @Operation(
            summary = "워크스페이스 파일 목록 조회",
            description = "워크스페이스 내에 업로드된 파일 목록을 페이징 처리하여 조회합니다."
    )
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
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(name = "page", defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(name = "size", defaultValue = "10") int size,
            @Parameter(description = "워크스페이스 ID", example = "1")
            @PathVariable(name = "workspace-id") Long workspaceId);

    @Operation(
            summary = "워크스페이스 설정 정보 조회",
            description = "설정 탭에서 표시할 워크스페이스의 기본 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WorkspaceDto.Info.class)
                    )),
    })
    @GetMapping("/{workspace-id}/settings")
    CommonResponse<?> getWorkspaceInfo(
            @Parameter(hidden = true) @AuthenticationPrincipal Member member,
            @Parameter(description = "워크스페이스 ID", example = "1")
            @PathVariable(name = "workspace-id") Long id);
}
