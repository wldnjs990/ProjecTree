package com.ssafy.projectree.domain.chat.usecase;

import com.ssafy.projectree.domain.chat.model.entity.ChatLog;
import com.ssafy.projectree.domain.chat.model.repository.ChatLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatLogService {

    private final ChatLogRepository chatLogRepository;

    public void save(ChatLog chatLog) {
        chatLogRepository.save(chatLog);
    }

}
