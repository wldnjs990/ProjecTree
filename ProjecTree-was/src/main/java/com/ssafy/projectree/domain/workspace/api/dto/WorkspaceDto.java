package com.ssafy.projectree.domain.workspace.api.dto;

import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.file.model.entity.FileProperty;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
import com.ssafy.projectree.domain.workspace.enums.Role;
import com.ssafy.projectree.domain.workspace.enums.ServiceType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class WorkspaceDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "WorkspaceDto.Insert", description = "워크 스페이스 생성")
    public static class Insert {

        @Schema(description = "워크 스페이스 이름", example = "AI Trip")
        private String name;

        @Schema(description = "워크 스페이스 설명 -> 프로젝트 주제", example = "AI기반 추천 여행 프로젝트")
        private String description;

        @Schema(description = "워크 스페이스 도메인", example = "여행")
        private String domain;

        @Schema(description = "워크 스페이스 시작일자(프로젝트 시작일자)", example = "2026-01-06")
        private LocalDate startDate;

        @Schema(description = "워크 스페이스 종료일자(프로젝트 종료일자)", example = "2026-02-09")
        private LocalDate endDate;

        @Schema(description = "워크 스페이스 목적", example = "학습용")
        private String purpose;

        @Schema(description = "식별자", example = "AIT")
        private String identifierPrefix;

        @Schema(description = "서비스 유형(WEB/APP 중 1개)", example = "WEB")
        private ServiceType serviceType;

        @Schema(
                description = "워크 스페이스 초대 멤버 목록(이메일, 역할) - 역할(OWNER/EDITOR/VIEWER)",
                example = "{\"example@gmail.com\": \"OWNER\", \"user@gmail.com\": \"EDITOR\"}"
        )
        private Map<String, Role> memberRoles;

        @Schema(description = "워크 스페이스 생성 시 입력받는 에픽 정보", example = """
                [
                    {"name": "항목1", "description": "설명1"},
                    {"name": "항목2", "description": "설명2"}
                ]
                """)
        private List<FunctionSpecificationDto.EpicInfo> epics;

        @Schema(description = "워크 스페이스 생성 시 입력받는 기술 스택들의 id값", example = "[1, 2, 3, ... ]")
        private List<Long> workspaceTechStacks;

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

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "워크 스페이스 진입 요청에 대한 응답 DTO")
    public static class Detail {

        private NodeTreeReadDto.Response nodeTree;

        private List<FileReadDto.Response> files;

        private List<FunctionSpecificationDto.EpicInfo> epics;

        private TeamDto.Info teamInfo;

    }
}
