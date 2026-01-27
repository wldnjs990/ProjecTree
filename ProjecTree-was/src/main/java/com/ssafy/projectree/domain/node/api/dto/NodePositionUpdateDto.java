package com.ssafy.projectree.domain.node.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class NodePositionUpdateDto {
    @Getter
    @NoArgsConstructor
    public static class Request {
        @NotEmpty
        @Valid
        private List<NodePositionItem> nodes;
    }

    @Getter
    @NoArgsConstructor
    public static class NodePositionItem {
        private String nodeId;

        private String requestId;

        @Valid
        private NodePositionUpdateDto.Position position;
    }

    @Getter
    @NoArgsConstructor
    public static class Position {

        @NotNull
        private Double x;

        @NotNull
        private Double y;
    }
}