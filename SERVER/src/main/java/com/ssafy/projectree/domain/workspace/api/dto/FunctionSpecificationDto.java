package com.ssafy.projectree.domain.workspace.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class FunctionSpecificationDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "워크 스페이스 생성 시 필요한 epic 노드 클래스")
    public static class EpicInfo {

        @Schema(description = "에픽 노드 이름", example = "인증/인가")
        private String name;

        @Schema(description = "에픽 노드에 대한 설명", example = "인증/인가를 통해 사용자의 서비스 이용에 대한 접근을 관리합니다.")
        private String description;

    }

}
