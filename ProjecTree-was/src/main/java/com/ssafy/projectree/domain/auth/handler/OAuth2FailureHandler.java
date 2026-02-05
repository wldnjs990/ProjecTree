package com.ssafy.projectree.domain.auth.handler;

import com.ssafy.projectree.domain.auth.model.repository.HttpCookieOAuth2AuthorizationRequestRepository;
import com.ssafy.projectree.domain.auth.utils.CookieUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

import static com.ssafy.projectree.domain.auth.model.repository.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@Component
@RequiredArgsConstructor
@Log4j2
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private final HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {

        // 1. 쿠키에서 리다이렉트 URI 가져오기 (성공 핸들러와 동일한 로직)
        // 프론트엔드가 요청 시 보낸 redirect_uri가 있다면 그리로, 없으면 기본 루트("/")로
        String targetUrl = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue).toString();

        // 2. 에러 메시지 결정
        String errorMessage = "알 수 없는 오류가 발생했습니다.";
        if (exception instanceof OAuth2AuthenticationException) {
            OAuth2AuthenticationException oauth2Exception = (OAuth2AuthenticationException) exception;
            OAuth2Error error = oauth2Exception.getError();

            log.info("OAuth2 Error Code: {}", error.getErrorCode()); // 디버깅용 로그

            // 사용자가 취소(Cancel)한 경우
            if ("access_denied".equals(error.getErrorCode())) {
                errorMessage = "CANCELED"; // 프론트에서 식별하기 쉬운 코드로 전달
            } else {
                errorMessage = error.getErrorCode();
            }
        }

        // 3. 타겟 URL에 에러 파라미터 추가
        // 예: http://localhost:3000/login?error=true&message=CANCELED
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .path("/login")
                .queryParam("error", "true")
                .queryParam("message", errorMessage)
                .build().encode().toUriString();

        log.info("OAuth2 Failure Redirect URL : {}", targetUrl);

        // 4. 인증 관련 쿠키 정리 (중요: 실패했더라도 임시 쿠키는 지워줘야 함)
        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);

        // 5. 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}