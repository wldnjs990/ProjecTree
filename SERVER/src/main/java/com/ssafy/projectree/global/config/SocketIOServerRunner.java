package com.ssafy.projectree.global.config;

import com.corundumstudio.socketio.SocketIOServer;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SocketIOServerRunner implements CommandLineRunner, DisposableBean {

    private final SocketIOServer socketIOServer;


    @Override
    public void destroy() throws Exception {
        socketIOServer.stop();
    }

    @Override
    public void run(String... args) throws Exception {
        socketIOServer.start();
    }
}
