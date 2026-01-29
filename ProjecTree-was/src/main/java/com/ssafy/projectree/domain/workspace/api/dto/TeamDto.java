package com.ssafy.projectree.domain.workspace.api.dto;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.enums.Role;
import lombok.Data;

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

}
