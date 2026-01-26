package com.ssafy.projectree.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.projectree.domain.ai.dto.schemas.CandidateSchema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class AiCandidateCreateDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request{
        @JsonProperty("node_id")
        private Long nodeId;
        @JsonProperty("workspace_id")
        private Long workspaceId;
        @JsonProperty("candidate_count")
        private int candidateCount;

    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response{
        @Builder.Default
        private List<CandidateSchema> candidates = new ArrayList<>();
    }
}
