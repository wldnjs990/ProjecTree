package com.ssafy.projectree.domain.workspace.api.controller;

import com.ssafy.projectree.domain.workspace.api.dto.VoiceTokenCreateDto;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import com.ssafy.projectree.global.exception.CustomException;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController
public class WorkspaceVoiceController {

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    /**
     * @param params JSON object with roomName and participantName
     * @return JSON object with the JWT token
     */
    @PostMapping("/voice/token")
    public CommonResponse<VoiceTokenCreateDto.Response> createToken(@RequestBody VoiceTokenCreateDto.Request params) {

        if (params.getRoomName() == null || params.getParticipantName() == null) {
            throw new BusinessLogicException(ErrorCode.WORKSPACE_VOICE_TOKEN_INVALID_REQUEST);
        }

        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setName(params.getParticipantName());
        token.setIdentity(params.getParticipantName());
        token.addGrants(new RoomJoin(true), new RoomName(params.getRoomName()));

        VoiceTokenCreateDto.Response response = VoiceTokenCreateDto.Response.builder().token(token.toJwt()).build();

        return CommonResponse.success(SuccessCode.CREATED, response);
    }

}
