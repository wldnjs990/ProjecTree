package com.ssafy.projectree.domain.workspace.api.dto;

import com.ssafy.projectree.domain.workspace.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class WorkspaceDto {

    public static class InsertRequest {

    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "WorkspaceDto.Response", description = "워크스페이스 조회 응답")
    public static class Response {

        @Schema(description = "워크 스페이스 ID", example = "1")
        private Long workspaceId;

        @Schema(description = "워크 스페이스 생성 시 입력한 이름입니다.", example = "프로젝트A")
        private String name;

        @Schema(description = "워크 스페이스 생성 시 입력한 설명입니다.", example = "설명...")
        private String description;

        @Schema(description = "워크 스페이스에 소속된 사용자의 수(팀원 수) 입니다.", example = "5")
        private int totalMembers;

        @Schema(description = "OWNER/VIEWER/EDITOR 중 1개, 해당 워크 스페이스 내 사용자의 역할입니다.", example = "OWNER")
        private Role role;

        @Schema(description = "우선순위별 진행도 정보")
        private ProgressInfo progress;

        @Schema(description = "Snapshot 기준 마지막 수정시간입니다.")
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "우선순위별 진행도 정보")
    public static class ProgressInfo {

        @Schema(description = "P0 우선순위 진행도", example = "p0: { total: 10, completed: 6 }")
        private PriorityProgress p0;

        @Schema(description = "P1 우선순위 진행도", example = "p1: { total: 7, completed: 3 }")
        private PriorityProgress p1;

        @Schema(description = "P2 우선순위 진행도", example = "p2: { total: 9, completed: 2 }")
        private PriorityProgress p2;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "우선순위별 상세 진행도")
    public static class PriorityProgress {

        @Schema(description = "전체 노드 개수", example = "10")
        private long total;

        @Schema(description = "완료된 노드 개수", example = "6")
        private long completed;
    }

}
