package com.ssafy.projectree.domain.ai.dto;

import com.ssafy.projectree.domain.ai.dto.schemas.UserTaskSchema;
import com.ssafy.projectree.domain.tech.api.dto.schemas.TechStackSchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

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
        private LocalDate projectStartAt;
        private LocalDate projectEndAt;
        private List<String> projectTechStack;
        private int projectHeadCount;
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
