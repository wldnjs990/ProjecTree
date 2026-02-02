package com.ssafy.projectree.domain.member.api.dto;

import com.ssafy.projectree.domain.auth.enums.AuthRole;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class MemberDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Info {

        private Long id;

        private String email;

        private String nickname;

        private AuthRole role;

        public static Info from(Member member) {
            return Info.builder()
                    .id(member.getId())
                    .email(member.getEmail())
                    .nickname(member.getNickname())
                    .role(member.getRole())
                    .build();
        }
    }

}
