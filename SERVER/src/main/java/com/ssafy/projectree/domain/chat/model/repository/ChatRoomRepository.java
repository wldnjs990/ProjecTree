package com.ssafy.projectree.domain.chat.model.repository;

import com.ssafy.projectree.domain.chat.model.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
}
