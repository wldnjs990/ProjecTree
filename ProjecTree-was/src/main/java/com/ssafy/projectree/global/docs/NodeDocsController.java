package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.node.api.dto.NodeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
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

    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommonResponse.class),
                            examples = @ExampleObject(
                                    value = """
                {
                  "status": "SUCCESS",
                  "code": 200,
                  "message": "요청에 성공하였습니다.",
                  "data": {
                    "tree": {
                      "id": 1,
                      "name": "루트 프로젝트",
                      "identifier": "PRJ-001",
                      "taskType": "CATEGORY",
                      "nodeStatus": "IN_PROGRESS",
                      "difficult": 1,
                      "nodeType": "ROOT",
                      "children": [
                        {
                          "id": 2,
                          "name": "로그인 모듈 개발",
                          "identifier": "TSK-010",
                          "taskType": "TASK",
                          "nodeStatus": "TODO",
                          "difficult": 3,
                          "nodeType": "EPIC",
                          "children": []
                        },
                        {
                          "id": 3,
                          "name": "DB 스키마 설계",
                          "identifier": "TSK-011",
                          "taskType": "TASK",
                          "nodeStatus": "DONE",
                          "difficult": 2,
                          "nodeType": "EPIC",
                          "children": []
                        }
                      ]
                    }
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
}