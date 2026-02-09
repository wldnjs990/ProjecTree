package com.ssafy.projectree.domain.auth.jwt;

import com.ssafy.projectree.domain.auth.provider.InternalPrincipal;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtUtils {

    private final JwtProvider provider;
    private final JwtResolver resolver;

    public Jwt generate(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof OAuth2User oAuth2User) {
            return provider.generate(oAuth2User);
        } else if (principal instanceof Member member) {
            return provider.generate(member);
        }
        throw new BusinessLogicException(ErrorCode.JWT_CREATE_FAILURE_ERROR, "지원하지 않는 인증 형식입니다.");
    }

    public Member resolveAccessToken(String authHeader) {

        return resolver.resolve(authHeader);
    }

    public Member resolveRefreshToken(String refreshToken) {
        return resolver.parse(refreshToken, JwtProperties.REFRESH_TOKEN_TYPE);
    }

    public InternalPrincipal resolveServiceToken(String authHeader) {
        return resolver.resolveServiceToken(authHeader);
    }

}
