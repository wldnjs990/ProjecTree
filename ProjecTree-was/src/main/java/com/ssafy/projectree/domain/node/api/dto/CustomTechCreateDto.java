package com.ssafy.projectree.domain.node.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class CustomTechCreateDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private Long workspaceId;
        private Long techVocaId;
    }

    @Getter
    @Builder
    public static class Response {
        private Long techVocaId;
        private String techName;
    }
}
