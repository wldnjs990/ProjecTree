package com.ssafy.projectree.domain.auth.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.projectree.domain.auth.enums.AuthRole;
import com.ssafy.projectree.domain.auth.jwt.Jwt;
import com.ssafy.projectree.domain.auth.jwt.JwtProvider;
import com.ssafy.projectree.domain.auth.jwt.JwtUtils;
import com.ssafy.projectree.domain.auth.utils.CookieUtils;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import static com.ssafy.projectree.domain.auth.jwt.JwtProperties.REFRESH_TOKEN_EXPIRE_TIME;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtils jwtUtils; // JWT 생성 클래스
    private final ObjectMapper om;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, IOException {
        Jwt jwt = jwtUtils.generate(authentication);
        Cookie cookie = CookieUtils.createRefreshTokenCookie(jwt.getRefreshToken());
        response.addCookie(cookie);
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter writer = response.getWriter();
        writer.println(om.writeValueAsString(
                CommonResponse.success(
                        SuccessCode.SUCCESS,
                        Map.of("accessToken", jwt.getAccessToken()),
                        "OAuth2 로그인 성공"
                )
        ));
        writer.flush();
    }
}
