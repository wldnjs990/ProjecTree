package com.ssafy.projectree.domain.node.api.dto;

import com.ssafy.projectree.domain.node.api.dto.schema.CandidateSchema;
import com.ssafy.projectree.domain.tech.api.dto.schemas.TechStackSchema;
import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import com.ssafy.projectree.domain.member.api.dto.schemas.MemberSchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
public class NodeReadDto {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "NodeReadDto.Response", description = "노드 상세 정보 응답")
    public static class Response {
        @Schema(description = "노드 식별자(PK)", example = "1")
        private Long id;

        @Schema(description = "담당자 정보")
        private MemberSchema assignee;

        @Schema(description = "노드 상세 설명", example = "OAuth2를 이용한 소셜 로그인 기능을 구현합니다.")
        private String description;

        @Schema(description = "비고/메모", example = "기한 엄수 요망")
        private String note;

        @Schema(description = "후보자(Candidate) 목록")
        @Builder.Default
        private List<CandidateSchema> candidates = new ArrayList<>();

        @Schema(description = "기술 스택 목록")
        @Builder.Default
        private List<TechStackSchema> techStackList = new ArrayList<>();
    }
}