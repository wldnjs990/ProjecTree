package com.ssafy.projectree.domain.node.api.dto.schema;

import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Schema(description = "노드 트리 구성을 위한 노드 스키마")
public class NodeSchema {
    @Schema(description = "노드 식별자", example = "1")
    private Long id;

    @Schema(description = "노드 이름", example = "프로젝트 루트")
    private String name;

    @Schema(description = "노드 유형 (카테고리/작업 등)")
    private NodeType nodeType;

    @Schema(description = "위치 정보")
    private PositionSchema position;

    @Schema(description = "현재 노드의 부모 Id",examples = {
            "null",
            "1"
    })
    private Long parentId;

    private Body data;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Body{
        @Schema(description = "우선순위", example = "PO")
        private Priority priority;

        @Schema(description = "노드 고유 번호", example = "NODE-001")
        private String identifier;

        @Schema(description = "작업 유형")
        private TaskType taskType;

        @Schema(description = "노드 상태", example = "IN_PROGRESS")
        private NodeStatus status;

        @Schema(description = "난이도", example = "2")
        private int difficult;

    }
}