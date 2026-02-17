package com.ssafy.projectree.domain.node.api.dto.schema;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionSchema {
    @Schema(description = "노드 x좌표", example = "100.0")
    private Double xPos;

    @Schema(description = "노드 y좌표", example = "100.0")
    private Double yPos;
}
