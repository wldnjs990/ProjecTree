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
@Schema(description = "후보자 정보 스키마")
public class CandidateSchema {
    @Schema(description = "후보자 식별자", example = "101")
    private Long id;

    @Schema(description = "후보자 이름", example = "홍길동")
    private String name;

    @Schema(description = "후보자 관련 설명", example = "백엔드 개발 경력 3년")
    private String description;
}