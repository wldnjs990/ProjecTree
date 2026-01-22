package com.ssafy.projectree.domain.workspace.api.controller;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
public class WorkspaceVoiceController {

    //TODO: 키 관리 필요
//    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY = "devkey";

//    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET = "this_is_my_very_long_secret_key_32chars";

    /**
     * @param params JSON object with roomName and participantName
     * @return JSON object with the JWT token
     */
    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> createToken(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setName(participantName);
        token.setIdentity(participantName);
        token.addGrants(new RoomJoin(true), new RoomName(roomName));
        log.info("join: Room: {}, name: {}", roomName, participantName);

        return ResponseEntity.ok(Map.of("token", token.toJwt()));
    }

}
