package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.node.api.dto.CandidateCreateDto;
import com.ssafy.projectree.domain.node.api.dto.CustomNodeDto;
import com.ssafy.projectree.domain.node.api.dto.CustomTechCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
import com.ssafy.projectree.domain.node.api.dto.TechStackRecommendDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Node", description = "노드 및 워크스페이스 트리 관련 API")
public interface NodeDocsController {

    @Operation(
            summary = "노드 상세 정보 조회",
            description = "특정 노드의 ID를 통해 상세 정보를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = NodeReadDto.Response.class)))
    })
    CommonResponse<NodeReadDto.Response> getNodeDetails(
            @Parameter(description = "조회할 노드의 ID", example = "1")
            @PathVariable(value = "node-id") Long nodeId
    );

    @Operation(
            summary = "노드 트리 조회",
            description = "워크스페이스 최초 진입 시 전체 노드 트리를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = NodeTreeReadDto.class),
                            examples = @ExampleObject(
                                    name = "노드 리스트 예시",
                                    value = """
                                            {
                                               "message": "Successfully Completed",
                                               "isSuccess": true,
                                               "code": 200,
                                               "data": {
                                                 "tree": [
                                                   {
                                                     "id": 1,
                                                     "name": "Projectree 루트",
                                                     "nodeType": "PROJECT",
                                                     "position": { "xPos": 0.0, "yPos": 0.0 },
                                                     "parentId": null,
                                                     "data": {
                                                       "priority": "P0",
                                                       "identifier": "NODE-001",
                                                       "taskType": "BE",
                                                       "status": "IN_PROGRESS",
                                                       "difficult": 2
                                                     }
                                                   }
                                                 ]
                                               }
                                             }
                                            """
                            )
                    )
            )
    })
    CommonResponse<NodeTreeReadDto.Response> getNodeTree(
            @Parameter(description = "조회할 워크스페이스의 ID", example = "10")
            @PathVariable(value = "workspace-id") Long workspaceId
    );

    @Operation(
            summary = "노드 생성",
            description = "후보 노드(Candidate)를 선택하여 새로운 자식 노드를 생성합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "생성 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = NodeCreateDto.Response.class)))
    })
    CommonResponse<NodeCreateDto.Response> createNode(
            @Parameter(description = "선택한 후보 노드 ID", example = "10")
            @PathVariable(name = "candidate-id") Long candidateId,
            @Parameter(description = "부모 노드 ID", example = "1")
            @PathVariable(name = "node-id") Long parentId,
            @RequestBody NodeCreateDto.Request request
    );

    @Operation(
            summary = "후보 노드 생성",
            description = "AI를 사용하여 특정 노드의 하위 후보 노드들을 자동 생성합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "생성 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CandidateCreateDto.Response.class)))
    })
    CommonResponse<CandidateCreateDto.Response> generateCandidates(
            @Parameter(description = "부모 노드 ID", example = "1")
            @PathVariable(name = "node-id") Long parentId
    );

    @Operation(
            summary = "후보 노드 삭제",
            description = "특정 후보 노드를 삭제합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 후보 노드")
    })
    CommonResponse<Void> deleteCandidate(
            @Parameter(description = "삭제할 후보 노드 ID", example = "1")
            @PathVariable(name = "candidate-id") Long candidateId
    );

    @Operation(
            summary = "기술 스택 추천",
            description = "특정 노드 구현에 적합한 기술 스택을 AI가 추천합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "추천 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TechStackRecommendDto.Response.class)))
    })
    CommonResponse<TechStackRecommendDto.Response> recommendTechStack(
            @Parameter(description = "노드 ID", example = "1")
            @PathVariable(name = "node-id") Long nodeId
    );

    @Operation(
            summary = "노드 커스텀 기술 스택 추가",
            description = "특정 노드에 사용자가 직접 기술 스택을 추가합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "기술 스택 추가 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 노드 또는 기술 스택"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    CommonResponse<Void> createCustomTechStack(
            @Parameter(description = "기술 스택을 추가할 노드 ID", example = "1")
            @PathVariable Long nodeId,
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "커스텀 기술 스택 생성 정보",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CustomTechCreateDto.Request.class),
                            examples = @ExampleObject(
                                    name = "요청 예시",
                                    value = """
                                        {
                                          "workspaceId": 10,
                                          "techVocaId": 5
                                        }
                                        """
                            )
                    )
            )
            CustomTechCreateDto.Request request
    );

    @Operation(
            summary = "커스텀 노드 생성",
            description = "사용자가 직접 노드를 생성하여 워크스페이스 트리에 추가합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "노드 생성 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CustomNodeDto.Response.class))),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    CommonResponse<CustomNodeDto.Response> createCustom(
            @Parameter(hidden = true) @AuthenticationPrincipal Member member,
            @RequestBody CustomNodeDto.Request dto);
}
