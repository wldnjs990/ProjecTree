package com.ssafy.projectree.domain.node.api.dto;

import com.ssafy.projectree.domain.node.api.dto.schema.CandidateSchema;
import com.ssafy.projectree.domain.node.api.dto.schema.TechStackSchema;
import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import com.ssafy.projectree.domain.user.api.dto.schemas.MemberSchema;
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
    public static class Response {
        private Long nodeId;
        private NodeStatus status;
        private Priority priority;
        private TaskType taskType;
        private MemberSchema assignee;
        private String name;
        private String description;
        private String note;
        private int difficult;

        @Builder.Default
        private List<CandidateSchema> candidates = new ArrayList<>();

        @Builder.Default
        private List<TechStackSchema> techStackList = new ArrayList<>();
    }
}
