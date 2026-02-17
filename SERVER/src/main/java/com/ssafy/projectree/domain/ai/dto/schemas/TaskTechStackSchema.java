package com.ssafy.projectree.domain.ai.dto.schemas;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskTechStackSchema {
    private String name;
    private String advantage;
    private String disadvantage;
    private String description;
}
