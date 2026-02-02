package com.ssafy.projectree.domain.chat.model.repository;

import com.ssafy.projectree.domain.chat.model.entity.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
}
