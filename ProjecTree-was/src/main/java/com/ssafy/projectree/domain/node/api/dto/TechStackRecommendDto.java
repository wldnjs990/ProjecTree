package com.ssafy.projectree.domain.node.api.dto;

import com.ssafy.projectree.domain.ai.dto.schemas.TechRecommendSchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class TechStackRecommendDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(name = "TechStackRecommendDto.Response", description = "기술 스택 생성 응답")
    public static class Response{
        @Builder.Default
        private List<TechRecommendSchema> techs = new ArrayList<>();
        private String comparison;
    }
}
