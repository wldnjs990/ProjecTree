package com.ssafy.projectree.domain.member.api.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

public class MemberReadDto {

    @Getter
    @Builder
    @Schema(name = "MemberReadDto.Response", description = "회원 상세 정보 조회 응답 DTO")
    public static class Response {

        @Schema(
                description = "회원 이름",
                example = "홍길동"
        )
        private String name;

        @Schema(
                description = "회원 닉네임",
                example = "projectree_user"
        )
        private String nickname;

        @Schema(
                description = "회원 이메일",
                example = "user@example.com"
        )
        private String email;
    }
}
