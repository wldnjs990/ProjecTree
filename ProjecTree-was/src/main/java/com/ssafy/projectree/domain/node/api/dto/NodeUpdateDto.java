package com.ssafy.projectree.domain.node.api.dto;

import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.Priority;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

public class NodeUpdateDto {
    @Getter
    @Setter
    @NoArgsConstructor
    @ToString
    public static class Request {
        private NodeType nodeType;
        private NodeStatus status;
        private Priority priority;
        private Integer difficult;
        private Long assignee;
        private String note;
    }
}