package com.ssafy.projectree.domain.member.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

public class MemberNicknameReadDto {

    @Getter
    @Builder
    @Schema(name = "MemberNicknameReadDto.Response", description = "닉네임 조회 응답 DTO")
    public static class Response {

        @Schema(
                description = "닉네임 존재 여부"
        )
        private boolean isExist;
    }
}
