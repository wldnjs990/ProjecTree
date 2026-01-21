package com.ssafy.projectree.domain.node.api.dto;

import com.ssafy.projectree.domain.node.api.dto.schema.CandidateSchema;
import com.ssafy.projectree.domain.tech.api.dto.schemas.TechStackSchema;
import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import com.ssafy.projectree.domain.user.api.dto.schemas.MemberSchema;
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
        private Long nodeId;

        @Schema(description = "노드 고유 번호/코드", example = "REQ-001")
        private String identifier;

        @Schema(description = "노드 진행 상태")
        private NodeStatus status;

        @Schema(description = "우선순위")
        private Priority priority;

        @Schema(description = "작업 유형")
        private TaskType taskType;

        @Schema(description = "담당자 정보")
        private MemberSchema assignee;

        @Schema(description = "노드 이름", example = "로그인 기능 구현")
        private String name;

        @Schema(description = "노드 상세 설명", example = "OAuth2를 이용한 소셜 로그인 기능을 구현합니다.")
        private String description;

        @Schema(description = "비고/메모", example = "기한 엄수 요망")
        private String note;

        @Schema(description = "난이도 (1-5)", example = "3")
        private int difficult;

        @Schema(description = "후보자(Candidate) 목록")
        @Builder.Default
        private List<CandidateSchema> candidates = new ArrayList<>();

        @Schema(description = "기술 스택 목록")
        @Builder.Default
        private List<TechStackSchema> techStackList = new ArrayList<>();
    }
}