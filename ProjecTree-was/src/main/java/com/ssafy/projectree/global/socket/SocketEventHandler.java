package com.ssafy.projectree.global.socket;

import com.corundumstudio.socketio.SocketIOServer;
import com.ssafy.projectree.domain.auth.jwt.JwtResolver;
import com.ssafy.projectree.domain.chat.usecase.ChatLogService;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.api.dto.ChatPayloadDto;
import com.ssafy.projectree.domain.workspace.usecase.ChatService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SocketEventHandler {

    private final SocketIOServer socketIOServer;
    private final ChatService chatService;
    private final JwtResolver jwtResolver;
    private final ChatLogService chatLogService;

    @PostConstruct
    public void init() {
        socketIOServer.addConnectListener(client -> {
            try {
                String token = client.getHandshakeData().getSingleUrlParam("token");

                Member member = jwtResolver.resolve(token);
                client.set("memberId", member.getId());
                log.info("Member {} connected [session: {}]", member.getId(), client.getSessionId());
            } catch (Exception e) {
                log.error("인증 실패: {}", e.getMessage());
                client.disconnect();
            }
        });

        socketIOServer.addDisconnectListener(client -> {
            Long memberId = client.get("memberId");
            log.info("Member {} disconnected [session: {}]",
                    memberId, client.getSessionId());
        });

        socketIOServer.addEventListener("chat:join", ChatPayloadDto.Join.class,
                (client, data, ackRequest) -> {
                    log.info("memberId: {} 사용자가 [id:{}] 채팅방에 진입했습니다. [session-id: {}]", client.get("memberId"), data.getChatRoomId(), client.getSessionId());
                    client.joinRoom(data.getChatRoomId());

                    List<ChatPayloadDto.MessageReceive> logs = chatLogService.history(data.getChatRoomId());
                    client.sendEvent("chat:history", logs);
                    log.info("[id:{}] 채팅방의 채팅 기록을 전달합니다.", data.getChatRoomId());
                }

        );

        socketIOServer.addEventListener("chat:leave", ChatPayloadDto.Leave.class,
                (client, data, ackRequest) -> {
                    client.leaveRoom(data.getChatRoomId());
                }
        );

        socketIOServer.addEventListener("message:send", ChatPayloadDto.MessageSend.class,
                (client, data, ackRequest) -> {

                    ChatPayloadDto.MessageReceive message = chatService.process(data, client);

                    String chatRoomId = data.getChatRoomId();
                    Long memberId = client.get("memberId");
                    log.info("memberId: {}번 사용자가 [id:{}] 채팅방에서 메세지[{}]를 전송했습니다.", memberId, chatRoomId, data.getContent());

                    socketIOServer.getRoomOperations(data.getChatRoomId())
                            .getClients().stream()
                            .filter(c -> !c.getSessionId().equals(client.getSessionId()))
                            .forEach(c -> c.sendEvent("message:receive", message));
                }
        );

        socketIOServer.addEventListener("typing:start", ChatPayloadDto.Typing.class,
                (client, data, ackRequest) -> {
                    socketIOServer.getRoomOperations(data.getChatRoomId())
                            .sendEvent("typing:start", data);
                }
        );

        socketIOServer.addEventListener("typing:stop", ChatPayloadDto.Typing.class,
                (client, data, ackRequest) -> {
                    socketIOServer.getRoomOperations(data.getChatRoomId())
                            .sendEvent("typing:stop", data);
                }
        );

    }
}
