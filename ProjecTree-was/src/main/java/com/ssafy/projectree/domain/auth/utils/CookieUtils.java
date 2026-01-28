package com.ssafy.projectree.domain.auth.utils;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Component;

import static com.ssafy.projectree.domain.auth.jwt.JwtProperties.REFRESH_TOKEN_EXPIRE_TIME;

@Component
public class CookieUtils {
    public static Cookie createRefreshTokenCookie(String token){
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge((int) REFRESH_TOKEN_EXPIRE_TIME);
        return cookie;
    }
}
