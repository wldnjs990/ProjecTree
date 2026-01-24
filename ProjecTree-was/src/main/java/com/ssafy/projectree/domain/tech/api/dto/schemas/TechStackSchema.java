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
    private Long id;
    private String name;
    private String advantage;
    private String disAdvantage;
    private String description;
    private String ref;
    private Integer recommendScore;
}
