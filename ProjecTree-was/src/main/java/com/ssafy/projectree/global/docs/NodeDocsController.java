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
                            schema = @Schema(implementation = NodeTreeReadDto.class),
                            examples = @ExampleObject(
                                    name = "노드 리스트 예시",
                                    value = """
                {
                  "status": "SUCCESS",
                  "code": 200,
                  "message": "요청에 성공하였습니다.",
                  "data": [
                    {
                      "id": 1,
                      "name": "루트 프로젝트",
                      "nodeType": "PROJECT",
                      "position": {
                        "xPos": 100.0,
                        "yPos": 200.0
                      },
                      "parentId": null,
                      "data": {
                        "identifier": "NODE-001",
                        "taskType": "CATEGORY",
                        "nodeStatus": "IN_PROGRESS",
                        "difficult": 3
                      }
                    },
                    {
                      "id": 2,
                      "name": "하위 작업 노드",
                      "nodeType": "EPIC",
                      "position": {
                        "xPos": 150.5,
                        "yPos": 300.0
                      },
                      "parentId": 1,
                      "data": {
                        "identifier": "NODE-002",
                        "taskType": "TASK",
                        "nodeStatus": "TODO",
                        "difficult": 1
                      }
                    }
                  ]
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