package com.ssafy.projectree.domain.internal.auth.controller;

import com.ssafy.projectree.domain.internal.auth.service.InternalAuthService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/internal")
public class InternalAuthController {

    private final InternalAuthService internalAuthService;

    @PostMapping("/token")
    public CommonResponse<InternalTokenResponse> issueToken(
            @RequestHeader("X-INTERNAL-KEY") String internalKey
    ) {
        log.info("create crdt token");
        String token = internalAuthService.issueNodeToken(internalKey);
        return CommonResponse.success(SuccessCode.SUCCESS,new InternalTokenResponse(token));
    }

    public record InternalTokenResponse(String token) {}
}

