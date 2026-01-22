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
    @Schema(name = "WorkspaceDto.Response", description = "특정 사용자의 워크 스페이스들을 조회하는 API입니다.")
    public static class Response {

        @Schema(name = "워크 스페이스 이름", description = "워크 스페이스 생성 시 입력한 이름입니다.")
        private String name;

        @Schema(name = "워크 스페이스 설명", description = "워크 스페이스 생성 시 입력한 설명입니다.")
        private String description;

        @Schema(name = "모든 노드의 개수", description = "워크 스페이스 내에 존재하는 모든 노드의 개수입니다.")
        private int totalNodes;

        @Schema(name = "완료 된 노드의 개수", description = "워크 스페이스 내에 완료 처리 된 노드의 개수입니다.")
        private int totalCompletedNodes;

        @Schema(name = "팀원 수", description = "워크 스페이스에 소속된 사용자의 수(팀원 수) 입니다.")
        private int totalMembers;

        @Schema(name = "역할", description = "OWNER/VIEWR/EDITOR 중 1개, 해당 워크 스페이스 내 사용자의 역할입니다.")
        private Role role;

        @Schema(name = "최종 수정 시간", description = "Snapshot 기준 마지막 수정시간입니다.")
        private LocalDateTime updatedAt;

    }

}
