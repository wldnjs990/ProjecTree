package com.ssafy.projectree.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    }
}
