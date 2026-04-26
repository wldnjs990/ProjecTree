package com.ssafy.projectree.domain.workspace.api.dto;

import com.ssafy.projectree.domain.member.api.dto.MemberDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class TeamDto {

    @Data
    public static class Join {

        private Member member;
        private Role role;

        private Join(Member member, Role role) {
            this.member = member;
            this.role = role;
        }

        public static TeamDto.Join of(Member member, Role role) {
            return new TeamDto.Join(member, role);
        }

    }

    @Getter
    @Builder
    @Schema(description = "팀 정보")
    public static class Info {

        @Schema(description = "채팅방 id", example = "saSCasd12Hbd4!@sa")
        private String chatRoomId;

        @Schema(description = "팀 멤버 정보")
        private List<MemberDto.Info> memberInfos;

    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "TeamDto.UpdateRoleRequest", description = "팀원 역할 변경 요청 DTO")
    public static class UpdateRoleRequest {

        @Schema(description = "워크스페이스 ID", example = "1")
        private Long workspaceId;

        @Schema(description = "역할을 변경할 대상 회원 ID", example = "42")
        private Long targetMemberId;

        @Schema(description = "변경할 역할 (OWNER / EDITOR / VIEWER)", example = "EDITOR")
        private Role role;

    }

    @Getter
    @Builder
    @Schema(name = "TeamDto.UpdateRoleResponse", description = "팀원 역할 변경 응답 DTO")
    public static class UpdateRoleResponse {

        @Schema(description = "역할이 변경된 회원 ID", example = "42")
        private Long memberId;

        @Schema(description = "변경된 역할", example = "EDITOR")
        private Role role;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "TeamDto.Invite", description = "팀원 초대 요청 DTO")
    public static class Invite {

        @Schema(description = "초대할 워크스페이스 ID", example = "1")
        private Long workspaceId;

        @Schema(description = "채팅방 ID", example = "saSCasd12Hbd4!@sa")
        private String chatRoomId;

        @Schema(description = "초대할 팀원 이메일", example = "invite@example.com")
        private String email;

        @Schema(description = "부여할 역할 (OWNER / EDITOR / VIEWER)", example = "EDITOR")
        private Role role;
    }

}
