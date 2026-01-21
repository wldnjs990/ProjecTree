package com.ssafy.projectree.domain.tech.api.dto.schemas;

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
    private Integer recommendScore;
    private boolean isRecommended;
}
