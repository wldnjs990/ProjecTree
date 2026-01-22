package com.ssafy.projectree.domain.node.api.dto.schema;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionSchema {
    private Double x_pos;
    private Double y_pos;
}
