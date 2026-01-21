package com.ssafy.projectree.domain.member.api.dto;

import lombok.Getter;

public class MemberNicknameUpdateDto {

    @Getter
    public static class Request {
        private String nickname;
    }

    @Getter
    public static class Response {

    }
}
