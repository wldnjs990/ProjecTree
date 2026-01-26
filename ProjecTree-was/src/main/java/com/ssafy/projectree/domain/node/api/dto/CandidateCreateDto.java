package com.ssafy.projectree.domain.node.api.dto;

import com.ssafy.projectree.domain.ai.dto.schemas.AiCandidateSchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class CandidateCreateDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(name = "CandidateCreateDto.Response", description = "후보 생성 응답")
    public static class Response{
        @Builder.Default
       List<AiCandidateSchema> candidates = new ArrayList<>();
    }
}
