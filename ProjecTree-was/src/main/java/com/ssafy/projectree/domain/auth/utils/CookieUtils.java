package com.ssafy.projectree.domain.auth.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;

import java.util.Base64;
import java.util.Optional;

import static com.ssafy.projectree.domain.auth.jwt.JwtProperties.REFRESH_TOKEN_EXPIRE_TIME;

@Component
public class CookieUtils {
    public static ResponseCookie createRefreshTokenCookie(String token){
        return ResponseCookie.from("refreshToken", token)
                .path("/")           // 모든 경로에서 쿠키 허용
                .httpOnly(true)      // JS에서 접근 불가능 (보안 필수)
                .secure(true)        // HTTPS에서만 전송 (SameSite=None 사용 시 필수)
                .maxAge(REFRESH_TOKEN_EXPIRE_TIME)
                .sameSite("None")    // 핵심: 서로 다른 도메인(Localhost <-> AWS) 간 쿠키 전송 허용
                .build();
    }
    // 1. 쿠키 조회
    public static Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return Optional.of(cookie);
                }
            }
        }
        return Optional.empty();
    }

    // 2. 쿠키 추가
    public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true); // JS에서 접근 불가능하도록 보안 설정
        cookie.setMaxAge(maxAge);

        //TODO: 배포시에는 true로 변경
        // HTTPS 환경이라면 Secure 설정 필수 (로컬 개발 시에는 주석 처리하거나 false로)
        // cookie.setSecure(true);

        response.addCookie(cookie);
    }

    // 3. 쿠키 삭제
    public static void deleteCookie(HttpServletRequest request, HttpServletResponse response, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    cookie.setValue("");
                    cookie.setPath("/");
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                }
            }
        }
    }

    // 4. 객체 직렬화 (Object -> String)
    // 쿠키 값에는 공백이나 특수문자가 들어갈 수 없으므로 Base64 인코딩 처리
    public static String serialize(Object object) {
        return Base64.getUrlEncoder()
                .encodeToString(SerializationUtils.serialize(object));
    }

    // 5. 객체 역직렬화 (Cookie -> Object)
    public static <T> T deserialize(Cookie cookie, Class<T> cls) {
        return cls.cast(SerializationUtils.deserialize(
                Base64.getUrlDecoder().decode(cookie.getValue())));
    }
}
