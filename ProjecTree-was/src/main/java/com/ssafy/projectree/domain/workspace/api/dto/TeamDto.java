package com.ssafy.projectree.domain.workspace.api.dto;

import com.ssafy.projectree.domain.member.api.dto.MemberDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.enums.Role;
import lombok.AllArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
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
    public static class UpdateRoleRequest {

        private Long workspaceId;
        private Long targetMemberId;
        private Role role;

    }

    @Getter
    @Builder
    public static class UpdateRoleResponse {
        private Long memberId;
        private Role role;
    }

}
