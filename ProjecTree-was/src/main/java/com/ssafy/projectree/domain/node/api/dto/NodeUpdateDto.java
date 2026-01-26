package com.ssafy.projectree.domain.node.api.dto;

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
        private String status;
        private String priority;
        private int difficult;
        private Long assignee;
        private String note;
    }
}