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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Node", description = "노드 및 워크스페이스 트리 관련 API")
public interface NodeDocsController {

    @Operation(
            summary = "노드 상세 정보 조회",
            description = "특정 노드의 ID를 통해 상세 정보를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            //        @ApiResponse(responseCode = "404", description = "존재하지 않는 노드입니다.", content = @Content)
    })
    CommonResponse<NodeReadDto.Response> getNodeDetails(
            @Parameter(description = "조회할 노드의 ID", example = "1")
            @PathVariable(value = "node-id") Long nodeId
    );

    @Operation(
            summary = "노드 트리 정보 조회",
            description = "워크스페이스 최초 진입시 워크스페이스의 노드 트리 전체를 조회합니다."
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
                                                     "position": {
                                                       "xPos": 0.0,
                                                       "yPos": 0.0
                                                     },
                                                     "parentId": null,
                                                     "data": {
                                                       "priority": "P0",
                                                       "identifier": "NODE-001",
                                                       "taskType": "BE",
                                                       "status": "IN_PROGRESS",
                                                       "difficult": 2
                                                     }
                                                   },
                                                   {
                                                     "id": 2,
                                                     "name": "인증 서버 설계",
                                                     "nodeType": "EPIC",
                                                     "position": {
                                                       "xPos": 120.5,
                                                       "yPos": 80.0
                                                     },
                                                     "parentId": 1,
                                                     "data": {
                                                       "priority": "P1",
                                                       "identifier": "NODE-002",
                                                       "taskType": "BE",
                                                       "status": "TODO",
                                                       "difficult": 3
                                                     }
                                                   },
                                                   {
                                                     "id": 3,
                                                     "name": "로그인 UI 구현",
                                                     "nodeType": "EPIC",
                                                     "position": {
                                                       "xPos": 120.5,
                                                       "yPos": 180.0
                                                     },
                                                     "parentId": 1,
                                                     "data": {
                                                       "priority": "P2",
                                                       "identifier": "NODE-003",
                                                       "taskType": "FE",
                                                       "status": "DONE",
                                                       "difficult": 1
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
            @ApiResponse(responseCode = "200", description = "생성 성공")
    })
    CommonResponse<NodeCreateDto.Response> createNode(
            @Parameter(description = "선택한 후보 노드 ID", example = "10")
            @PathVariable(name = "candidate-id") Long candidateId,
            @Parameter(description = "부모 노드 ID", example = "1")
            @PathVariable(name = "node-id") Long parentId,
            @RequestBody NodeCreateDto.Request request
    );

    @Operation(
            summary = "노드 후보 생성",
            description = "특정 부모 노드 하위에 생성 가능한 노드 후보들을 AI를 통해 생성합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "생성 성공")
    })
    CommonResponse<CandidateCreateDto.Response> createCandidates(
            @Parameter(description = "부모 노드 ID", example = "1")
            @PathVariable(name = "node-id") Long parentId,
            @RequestBody CandidateCreateDto.Request request
    );

    @Operation(
            summary = "후보 노드 삭제",
            description = "특정 후보 노드를 삭제합니다. (소프트 딜리트)"
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
            description = "특정 노드 구현에 적합한 기술 스택을 추천받습니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "추천 성공")
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
            summary = "커스텀 노드 생성 API",
            description = "사용자가 직접 노드를 생성하여 추가합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "노드 생성 성공"),
            @ApiResponse(responseCode = "401", description = "토큰 만료로 인한 노드 생성 실패")
    })
    CommonResponse<?> createCustom(Member member, CustomNodeDto.Request dto);
}