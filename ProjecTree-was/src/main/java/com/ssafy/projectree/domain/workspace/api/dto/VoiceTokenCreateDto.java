package com.ssafy.projectree.domain.workspace.api.dto;

import lombok.Builder;
import lombok.Getter;

public class VoiceTokenCreateDto {

    @Getter
    public static class Request {
        private String roomName;
        private String participantName;
    }

    @Builder
    public static class Response {
        private String token;
    }
}
