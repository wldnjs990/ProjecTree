package com.ssafy.projectree.domain.workspace.usecase;

import com.corundumstudio.socketio.SocketIOClient;
import com.ssafy.projectree.domain.chat.model.entity.ChatRoom;
import com.ssafy.projectree.domain.chat.model.repository.ChatRoomRepository;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.usecase.MemberService;
import com.ssafy.projectree.domain.workspace.api.dto.ChatPayloadDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final MemberService memberService;
    private final ChatRoomRepository chatRoomRepository;

    public ChatPayloadDto.MessageReceive process(ChatPayloadDto.MessageSend data, SocketIOClient client) {
//        Member member = memberService.findByEmail("todo@example.com");
        // TODO: Member 조회 후 Message에 사용자 ID, name 담기

        ChatPayloadDto.MessageReceive message = new ChatPayloadDto.MessageReceive();
        message.setId(UUID.randomUUID().toString());
        message.setWorkspaceId(data.getWorkspaceId());
        message.setContent(data.getContent());
        message.setTimestamp(Instant.now().toString());
//        message.setSenderId(member.getId().toString());
//        message.setSenderName(member.getName());

//        log.info("{}님이 전송한 메시지: {}", member.getName(), data.getContent());
        return message;
    }

    public ChatRoom create() {

        String uuid = UUID.randomUUID().toString();
        ChatRoom chatRoom = new ChatRoom(uuid);

        chatRoomRepository.save(chatRoom);

        return chatRoom;
    }

}
