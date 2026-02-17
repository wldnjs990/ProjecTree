package com.ssafy.projectree.domain.node.api.dto.schema;

import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import com.ssafy.projectree.domain.node.model.entity.AdvanceNode;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.TaskNode;
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

    @Schema(description = "현재 노드의 부모 Id", examples = {
            "null",
            "1"
    })
    private Long parentId;

    @Schema(description = "클라이언트 preview 노드 식별자", example = "preview-42")
    private String previewNodeId;

    private Body data;

    public static NodeSchema convertToSchema(Node entity, Long parentId) {
        // 공통 데이터 매핑
        NodeSchema.Body body = NodeSchema.Body.builder()
                .priority(entity.getPriority())
                .identifier(entity.getIdentifier())
                .status(entity.getStatus())
                .build();

        // 자식 타입에 따른 특화 데이터 매핑 (instanceof 활용)
        if (entity instanceof TaskNode task) {
            body.setTaskType(task.getType());
            body.setDifficult(task.getDifficult());
        } else if (entity instanceof AdvanceNode advance) {
            body.setDifficult(advance.getDifficult());
        }

        return NodeSchema.builder()
                .id(entity.getId())
                .name(entity.getName())
                .nodeType(entity.getNodeType())
                .parentId(parentId)
                .position(new PositionSchema(entity.getXPos(), entity.getYPos()))
                .data(body)
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Body {
        @Schema(description = "우선순위", example = "PO")
        private Priority priority;

        @Schema(description = "노드 고유 번호", example = "NODE-001")
        private String identifier;

        @Schema(description = "작업 유형")
        private TaskType taskType;

        @Schema(description = "노드 상태", example = "IN_PROGRESS")
        private NodeStatus status;

        @Schema(description = "난이도", example = "2")
        private Integer difficult;

    }
}