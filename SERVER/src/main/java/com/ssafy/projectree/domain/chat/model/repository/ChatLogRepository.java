package com.ssafy.projectree.domain.chat.model.repository;

import com.ssafy.projectree.domain.chat.model.entity.ChatLog;
import com.ssafy.projectree.domain.chat.model.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {

    List<ChatLog> findAllByChatRoomOrderByCreatedAt(ChatRoom chatRoom);

}
