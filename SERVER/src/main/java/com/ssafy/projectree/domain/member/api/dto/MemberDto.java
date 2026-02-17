package com.ssafy.projectree.domain.member.api.dto;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.enums.Role;
import com.ssafy.projectree.domain.workspace.model.entity.Team;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "MemberDto", description = "멤버 전용 DTO")
public class MemberDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "MemberDto.Info", description = "워크 스페이스 소속 멤버 정보")
    public static class Info {

        @Schema(description = "memberId", example = "1")
        private Long id;

        @Schema(description = "member email", example = "test@gmail.com")
        private String email;

        @Schema(description = "member nickname", example = "test")
        private String nickname;

        @Schema(description = "member role", example = "OWNER")
        private Role role;


        public static Info from(Team team) {
            Member member = team.getMember();

            return Info.builder()
                    .id(member.getId())
                    .email(member.getEmail())
                    .nickname(member.getNickname())
                    .role(team.getRole())
                    .build();
        }
    }

}
