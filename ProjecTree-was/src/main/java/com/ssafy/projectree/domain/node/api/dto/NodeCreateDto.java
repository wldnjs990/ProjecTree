package com.ssafy.projectree.domain.node.api.dto;

import lombok.*;

public class NodeCreateDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request{
        private long parentId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response{

    }
}
