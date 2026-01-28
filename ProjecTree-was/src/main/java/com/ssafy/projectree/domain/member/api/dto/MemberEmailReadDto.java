package com.ssafy.projectree.domain.member.api.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

public class MemberEmailReadDto {

    @Getter
    @Builder
    @Schema(name = "MemberEmailReadDto.Response", description = "회원 이메일 조회 응답 DTO")
    public static class Response {

        @Schema(
                description = "회원 이메일",
                example = "user@example.com"
        )
        private String email;
    }
}
