package com.ssafy.projectree.domain.node.api.dto.schema;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TechStackSchema {
    private String name;
    private String description;
    private Long id;
    private String advantage;
    private String disAdvantage;
}
