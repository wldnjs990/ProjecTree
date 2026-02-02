package com.ssafy.projectree.domain.chat.usecase;

import com.ssafy.projectree.domain.chat.model.entity.ChatRoom;
import com.ssafy.projectree.domain.chat.model.repository.ChatRoomRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoom findById(String chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.CHATROOM_NOT_FOUND));
    }

    public void save(ChatRoom chatRoom) {
        chatRoomRepository.save(chatRoom);
    }
}
