package com.ssafy.projectree.domain.node.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


public class CandidateCreateDto {

    @Data
    @NoArgsConstructor
    public static class Request{
        private Long workspaceId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(name = "CandidateCreateDto.Response", description = "후보 생성 응답")
    public static class Response{
       Long nodeId;
    }
}
