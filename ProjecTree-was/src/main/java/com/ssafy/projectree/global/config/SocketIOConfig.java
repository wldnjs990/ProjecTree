package com.ssafy.projectree.global.config;

import com.corundumstudio.socketio.AuthorizationResult;
import com.corundumstudio.socketio.SocketIOServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@Slf4j
@Configuration
@EnableWebSocket
public class SocketIOConfig {

    @Value("${socket.host}")
    private String host;

    @Value("${socket.port}")
    private int port;

    // TODO: Jwt 관련 Util 필요 - 토큰 파싱

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration configuration = new com.corundumstudio.socketio.Configuration();

        configuration.setHostname(host);
        configuration.setPort(port);
        configuration.setOrigin("*");

        configuration.setAuthorizationListener(data -> {
            String accessToken = data.getHttpHeaders().get("Authorization");

            // TODO: 토큰 추가 시 주석 해제
//            if (accessToken == null) {
//                log.warn("토큰이 존재하지 않음");
//                return AuthorizationResult.FAILED_AUTHORIZATION;
//            }

//            String token = accessToken.substring(7); // "Bearer " 제거

            // 토큰 검증
//             if (!jwtProvider.validate(token)) {
//                 log.error("토큰 검증 실패");
//                 return AuthorizationResult.FAILED_AUTHORIZATION
//             }

            return AuthorizationResult.SUCCESSFUL_AUTHORIZATION;
        });

        return new SocketIOServer(configuration);
    }
}
