package com.ssafy.projectree.domain.auth.handler;

import com.ssafy.projectree.domain.auth.jwt.Jwt;
import com.ssafy.projectree.domain.auth.jwt.JwtUtils;
import com.ssafy.projectree.domain.auth.model.repository.HttpCookieOAuth2AuthorizationRequestRepository;
import com.ssafy.projectree.domain.auth.utils.AuthHash;
import com.ssafy.projectree.domain.auth.utils.CookieUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import static com.ssafy.projectree.domain.auth.model.repository.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@Component
@RequiredArgsConstructor
@Log4j2
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils; // JWT 생성 클래스
    private final HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository; // 주입 필요    @Override
    private final AuthHash authHash;

    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        Jwt generate = jwtUtils.generate(authentication);
        UUID uuid = UUID.fromString(generate.getAccessToken());
        String uuidStr = uuid.toString().replace("-", "");
        authHash.put(uuidStr, generate);
        String targetUrl = determineTargetUrl(request, response, uuidStr);
        if (response.isCommitted()) {
            return;
        }
        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, String ticket) {
        // 1. 쿠키에서 redirect_uri가 있는지 확인
        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);
        log.info("redirect URL : {}", redirectUri);
        String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
                .replacePath(null) // 기존 경로(/login/oauth2/...) 제거
                .build()
                .toUriString();

        // 3. 쿠키가 있으면 그걸 쓰고, 없으면 [현재 도메인 + /oauth/callback] 사용
        String targetUrl = redirectUri.orElse(baseUrl + "/oauth/callback");

        log.info("Final Target URL : {}", targetUrl);

        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("code", ticket)
                .build().toUriString();
    }
}
