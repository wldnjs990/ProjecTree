package com.ssafy.projectree.domain.node.api.dto.schema;

import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.TaskType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Schema(description = "노드 트리 구성을 위한 스키마")
public class NodeSchema {
    @Schema(description = "노드 식별자", example = "1")
    private Long id;

    @Schema(description = "노드 이름", example = "프로젝트 루트")
    private String name;

    @Schema(description = "노드 고유 번호", example = "NODE-001")
    private String identifier;

    @Schema(description = "작업 유형")
    private TaskType taskType;

    @Schema(description = "노드 상태")
    private NodeStatus nodeStatus;

    @Schema(description = "난이도", example = "2")
    private int difficult;

    @Schema(description = "노드 유형 (카테고리/작업 등)")
    private NodeType nodeType;

    @Schema(description = "하위 노드 목록 (재귀 구조)", example = )
    @Builder.Default
    private List<NodeSchema> children = new ArrayList<>();
}