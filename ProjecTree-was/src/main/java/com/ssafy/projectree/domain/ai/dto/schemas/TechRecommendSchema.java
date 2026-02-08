package com.ssafy.projectree.domain.ai.dto.schemas;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechRecommendSchema {
    private Long id;
    private String name;
    private String advantage;
    private String disadvantage;
    private String description;
    private String ref;
    @JsonProperty("recommendation_score")
    private int recommendationScore;
}
