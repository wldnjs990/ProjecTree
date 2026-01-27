package com.ssafy.projectree.domain.workspace.api.dto;

import lombok.Data;

public class ChatPayloadDto {

    @Data
    public static class Join {
        private String workspaceId;
    }

    @Data
    public static class Leave {
        private String workspaceId;
    }

    @Data
    public static class MessageSend {
        private String workspaceId;
        private String content;
    }

    /**
     * ChatPayloadDto.MessageReceive <br>
     * description: Client에서 보낸 메세지를 Server에서 받을 때 사용.
     */
    @Data
    public static class MessageReceive {
        private String id;
        private String workspaceId;
        private String senderId;
        private String senderName;
        private String content;
        private String timestamp;
    }

    @Data
    public static class Typing {
        private String workspaceId;
        private String userId;
        private String userName;
    }
}