package com.ssafy.projectree.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.projectree.domain.ai.dto.schemas.TechRecommendSchema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class AiTechRecommendDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request{
        @JsonProperty("workspace_id")
        private Long workspaceId;
        @JsonProperty("node_id")
        private Long nodeId;
    }


    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response{
        @Builder.Default
        private List<TechRecommendSchema> techs = new ArrayList<>();
        private String comparison;
    }
}
