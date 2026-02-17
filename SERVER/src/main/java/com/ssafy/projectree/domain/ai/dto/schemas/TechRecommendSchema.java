package com.ssafy.projectree.domain.ai.dto.schemas;

import com.fasterxml.jackson.annotation.JsonAlias;
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
    @JsonProperty("disAdvantage")
    @JsonAlias("disadvantage")
    private String disAdvantage;
    private String description;
    private String ref;
    @JsonProperty("recommendScore")
    @JsonAlias("recommendation_score")
    private int recommendScore;
}
