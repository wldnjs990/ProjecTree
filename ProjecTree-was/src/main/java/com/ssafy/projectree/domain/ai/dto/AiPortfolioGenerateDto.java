package com.ssafy.projectree.domain.ai.dto;

import com.ssafy.projectree.domain.ai.dto.schemas.UserTaskSchema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AiPortfolioGenerateDto {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request{
        private String projectTitle;
        private String projectDescription;
        private LocalDate projectStartDate;
        private LocalDate projectEndDate;
        private List<String> projectTechStack;
        private int projectHeadCount;
        private Long memberId;
        private Long workspaceId;
        @Builder.Default
        private List<UserTaskSchema> userTaskSchemas = new ArrayList<>();

    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response{
        private String content;
    }



}
