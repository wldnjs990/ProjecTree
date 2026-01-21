package com.ssafy.projectree.domain.member.api.dto;

import lombok.Builder;
import lombok.Getter;

public class MemberReadDto {

    @Getter
    @Builder
    public static class Response {
        private String name;
        private String nickname;
        private String email;
    }
}
