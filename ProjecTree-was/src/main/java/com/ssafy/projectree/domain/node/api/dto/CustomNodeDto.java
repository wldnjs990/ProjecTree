package com.ssafy.projectree.domain.node.api.dto;

import com.ssafy.projectree.domain.node.enums.NodeType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class CustomNodeDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "CustomNodeDto.Request", description = "커스텀 노드 생성 요청 DTO")
    public static class Request {

        private String name;
        private String description;
        private NodeType nodeType;
        private Long parentNodeId;
        private Long workspaceId;
        private Double xPos;
        private Double yPos;

    }

    @Builder
    @Schema(name = "CustomNodeDto.Response", description = "커스텀 노드 생성 응답 DTO")
    public static class Response {

        private String name;
        private String description;
        private NodeType nodeType;
        private Long parentNodeId;
        private Double xPos;
        private Double yPos;

    }

}
