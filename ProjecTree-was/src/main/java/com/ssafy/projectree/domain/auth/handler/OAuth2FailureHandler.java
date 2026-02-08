package com.ssafy.projectree.domain.auth.handler;

import com.ssafy.projectree.domain.auth.model.repository.HttpCookieOAuth2AuthorizationRequestRepository;
import com.ssafy.projectree.domain.auth.utils.CookieUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Log4j2 대신 Slf4j 추천 (취향차이)
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
@Slf4j
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private final HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {

        // ★ [수정됨] Optional 처리 방식 변경
        // 쿠키가 있으면 그 값을 쓰고, 없으면(취소 등) 기본 루트("/")로 설정
        String targetUrl = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue)
                .orElse("/login");

        // 2. 에러 메시지 결정
        String errorMessage = "알 수 없는 오류가 발생했습니다.";

        if (exception instanceof OAuth2AuthenticationException) {
            OAuth2AuthenticationException oauth2Exception = (OAuth2AuthenticationException) exception;
            OAuth2Error error = oauth2Exception.getError();

            log.info("OAuth2 Error Code: {}", error.getErrorCode());

            // authorization_request_not_found: 취소했거나 세션이 끊겨서 요청 정보를 못 찾을 때 발생
            if ("access_denied".equals(error.getErrorCode()) || "authorization_request_not_found".equals(error.getErrorCode())) {
                errorMessage = "CANCELED";
            } else {
                errorMessage = error.getErrorCode();
            }
        }

        // 3. 타겟 URL 재조립
        // targetUrl이 "/" 인 경우 -> http://localhost:3000/login?error... 형태로 만들어짐
        // (주의: targetUrl이 프론트엔드 주소여야 합니다)
        String redirectUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .path("/login") // 로그인 페이지 경로 붙이기
                .queryParam("error", "true")
                .queryParam("message", errorMessage)
                .build().encode().toUriString();

        log.info("OAuth2 Failure Redirect URL : {}", redirectUrl);

        // 4. 쿠키 정리
        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);

        // 5. 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}