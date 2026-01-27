package com.ssafy.projectree.global.socket;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import com.ssafy.projectree.domain.workspace.api.dto.ChatPayloadDto;
import com.ssafy.projectree.domain.workspace.usecase.ChatService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class SocketEventHandler {

    private final SocketIOServer socketIOServer;
    private final ChatService chatService;
    // private final JwtProvider jwtProvider;

    @PostConstruct
    public void init() {
        socketIOServer.addConnectListener(client -> {
//            String accessToken = client.getHandshakeData().getHttpHeaders().get("Authorization").substring(7);
//            Long userId = jwtProvider.getId(accessToken);
//            log.info("Client connected: {}", client.getSessionId());
        });

        socketIOServer.addDisconnectListener(client -> {
//            log.info("Client disconnected: {}", client.getSessionId());
        });

        socketIOServer.addEventListener("chat:join", ChatPayloadDto.Join.class,
                (client, data, ackRequest) -> {
                    Long userId = 1L;
                    client.set("userId", userId);
                    log.info("userId: {} 사용자가 {}번 workspace 진입했습니다. [session-id: {}]", userId, data.getWorkspaceId(), client.getSessionId());
                    client.joinRoom(data.getWorkspaceId());
                }
        );

        socketIOServer.addEventListener("chat:leave", ChatPayloadDto.Leave.class,
                (client, data, ackRequest) -> {
                    client.leaveRoom(data.getWorkspaceId());
                }
        );

        socketIOServer.addEventListener("message:send", ChatPayloadDto.MessageSend.class,
                (client, data, ackRequest) -> {

                    Map<String, Object> response = new HashMap<>();
                    response.put("message", chatService.process(data, client));

                    // 방법 1: 클라이언트 수 직접 확인
                    int clientCount = socketIOServer.getRoomOperations(data.getWorkspaceId())
                            .getClients()
                            .size();
                    log.info("Room {} has {} clients", data.getWorkspaceId(), clientCount);

                    socketIOServer.getRoomOperations(data.getWorkspaceId())
                            .getClients().stream()
                            .filter(c -> !c.getSessionId().equals(client.getSessionId()))
                            .forEach(c -> c.sendEvent("message:receive", response));
                }
        );

        socketIOServer.addEventListener("typing:start", ChatPayloadDto.Typing.class,
                (client, data, ackRequest) -> {
                    socketIOServer.getRoomOperations(data.getWorkspaceId())
                            .sendEvent("typing:start", data);
                }
        );

        socketIOServer.addEventListener("typing:stop", ChatPayloadDto.Typing.class,
                (client, data, ackRequest) -> {
                    socketIOServer.getRoomOperations(data.getWorkspaceId())
                            .sendEvent("typing:stop", data);
                }
        );

    }
}
