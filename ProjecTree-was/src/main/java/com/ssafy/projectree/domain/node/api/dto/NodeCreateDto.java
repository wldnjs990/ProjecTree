package com.ssafy.projectree.domain.node.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class NodeCreateDto {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "NodeCreateDto.Request", description = "노드 생성 요청")
    public static class Request{
        private Double xPos;
        private Double yPos;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "NodeCreateDto.Response", description = "노드 생성 응답")
    public static class Response{
        private Long nodeId;
    }
}
