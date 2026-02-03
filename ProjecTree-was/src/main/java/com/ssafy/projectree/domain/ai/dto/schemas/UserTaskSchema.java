package com.ssafy.projectree.domain.ai.dto.schemas;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//사용자가 본인이 수행한 작업에 대한 정보를 가진 스키마
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTaskSchema {
    private String taskName;
    private String taskDescription;
    private String taskNote;
    private TaskTechStackSchema techStack;
}
