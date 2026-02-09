package com.ssafy.projectree.domain.workspace.usecase;

import com.corundumstudio.socketio.SocketIOClient;
import com.ssafy.projectree.domain.chat.model.entity.ChatLog;
import com.ssafy.projectree.domain.chat.model.entity.ChatRoom;
import com.ssafy.projectree.domain.chat.usecase.ChatLogService;
import com.ssafy.projectree.domain.chat.usecase.ChatRoomService;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.usecase.MemberService;
import com.ssafy.projectree.domain.workspace.api.dto.ChatPayloadDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final MemberService memberService;
    private final ChatRoomService chatRoomService;
    private final ChatLogService chatLogService;

    @Transactional
    public ChatPayloadDto.MessageReceive process(ChatPayloadDto.MessageSend data, SocketIOClient client) {
        Long memberId = client.get("memberId");
        Member member = memberService.findById(memberId);
        ChatRoom chatRoom = chatRoomService.findById(data.getChatRoomId());

        ChatLog chatLog = ChatLog.builder()
                .chatRoom(chatRoom)
                .nickname(member.getNickname())
                .memberId(member.getId())
                .content(data.getContent())
                .build();

        chatLogService.save(chatLog);

        ChatPayloadDto.MessageReceive message = new ChatPayloadDto.MessageReceive();
        message.setId(chatLog.getId());
        message.setChatRoomId(data.getChatRoomId());
        message.setContent(data.getContent());
        message.setTimestamp(chatLog.getCreatedAt().toString());
        message.setSenderId(member.getId());
        message.setSenderName(member.getName());

        log.info("{}님이 전송한 메시지: {}", member.getNickname(), data.getContent());
        return message;
    }

    public ChatRoom create() {

        String uuid = UUID.randomUUID().toString();
        ChatRoom chatRoom = new ChatRoom(uuid);

        chatRoomService.save(chatRoom);

        return chatRoom;
    }

}
