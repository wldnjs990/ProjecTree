package com.ssafy.projectree.domain.node.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

public class NodeTechSelectDto {

    @Data
    @NoArgsConstructor
    public static class Request {
        private Long selectedTechId;
    }
}
