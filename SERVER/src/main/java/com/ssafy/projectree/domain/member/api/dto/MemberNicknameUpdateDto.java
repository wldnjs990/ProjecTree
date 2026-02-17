package com.ssafy.projectree.domain.member.api.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

public class MemberNicknameUpdateDto {

    @Getter
    @Schema(name = "MemberNicknameUpdateDto.Request", description = "회원 닉네임 변경 요청 DTO")
    public static class Request {

        @Schema(
                description = "변경할 닉네임",
                example = "projectree_user"
        )
        private String nickname;
    }

    @Builder
    @Getter
    @Schema(name = "MemberNicknameUpdateDto.Response", description = "회원 닉네임 변경 응답 DTO")
    public static class Response {

        @Schema(
                description = "변경된 닉네임",
                example = "projectree_user"
        )
        private String nickname;
    }
}
