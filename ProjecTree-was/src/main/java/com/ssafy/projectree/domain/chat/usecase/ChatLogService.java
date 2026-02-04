package com.ssafy.projectree.domain.chat.usecase;

import com.ssafy.projectree.domain.chat.model.entity.ChatLog;
import com.ssafy.projectree.domain.chat.model.entity.ChatRoom;
import com.ssafy.projectree.domain.chat.model.repository.ChatLogRepository;
import com.ssafy.projectree.domain.workspace.api.dto.ChatPayloadDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatLogService {

    private final ChatRoomService chatRoomService;
    private final ChatLogRepository chatLogRepository;

    public void save(ChatLog chatLog) {
        chatLogRepository.save(chatLog);
    }

    public List<ChatPayloadDto.MessageReceive> history(String chatRoomId) {

        ChatRoom chatRoom = chatRoomService.findById(chatRoomId);
        List<ChatLog> logs = chatLogRepository.findAllByChatRoomOrderByCreatedAt(chatRoom);

        return logs.stream()
                .map(log -> {
                    ChatPayloadDto.MessageReceive message = new ChatPayloadDto.MessageReceive();
                    message.setId(log.getId());
                    message.setChatRoomId(chatRoomId);
                    message.setContent(log.getContent());
                    message.setTimestamp(log.getCreatedAt().toString());
                    message.setSenderId(log.getMemberId());
                    message.setSenderName(log.getNickname());
                    return message;
                })
                .collect(Collectors.toList());
    }
}
