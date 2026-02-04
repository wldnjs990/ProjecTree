package com.ssafy.projectree.domain.workspace.api.dto;

import com.ssafy.projectree.domain.member.api.dto.MemberDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.enums.Role;
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
    public static class Info {

        private String chatRoomId;

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
