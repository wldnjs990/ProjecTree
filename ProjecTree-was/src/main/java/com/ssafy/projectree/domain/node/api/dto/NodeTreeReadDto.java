package com.ssafy.projectree.domain.node.api.dto;

import com.ssafy.projectree.domain.node.api.dto.schema.NodeSchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
public class NodeTreeReadDto {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "NodeTreeReadDto.Response", description = "노드 트리 구조 조회 응답")
    public static class Response {
        @Schema(description = "최상위 노드부터 시작되는 트리 구조")
        private NodeSchema tree;
    }
}