package com.ssafy.projectree.domain.node.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class CustomTechCreateDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "CustomTechCreateDto.Request", description = "커스텀 기술 스택 생성 요청")
    public static class Request {
        @Schema(description = "워크스페이스 ID", example = "10")
        private Long workspaceId;

        @Schema(description = "기술 단어(TechVocabulary) ID", example = "3")
        private Long techVocaId;
    }

    @Getter
    @Builder
    @Schema(name = "CustomTechCreateDto.Response", description = "커스텀 기술 스택 생성 응답")

    public static class Response {

        @Schema(description = "기술 단어(TechVocabulary) ID", example = "3")
        private Long techVocaId;
        @Schema(description = "기술 이름", example = "java")
        private String techName;
    }
}
