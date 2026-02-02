package com.ssafy.projectree.domain.internal.auth.service;

import com.ssafy.projectree.domain.auth.jwt.JwtProvider;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class InternalAuthService {

    private final JwtProvider jwtProvider;

    @Value("${internal.auth.api-key}")
    private String expectedKey;

    public String issueNodeToken(String providedKey) {

        if (!expectedKey.equals(providedKey)) {
            throw new BusinessLogicException(ErrorCode.TOKEN_INVALID_SIGNATURE);
        }
        return jwtProvider.generateInternalToken();
    }
}
