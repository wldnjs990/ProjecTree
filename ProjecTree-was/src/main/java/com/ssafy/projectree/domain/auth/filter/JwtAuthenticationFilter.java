package com.ssafy.projectree.domain.auth.filter;


import com.ssafy.projectree.domain.auth.jwt.JwtProvider;
import com.ssafy.projectree.domain.auth.provider.JwtAuthenticationProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static com.ssafy.projectree.domain.auth.jwt.JwtProperties.AUTH_HEADER;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private final JwtAuthenticationProvider provider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(AUTH_HEADER);
        String requestUrl = request.getRequestURI();

        /**
         * header에 authorization 이 없다면 다음 필터체인으로 넘김.
         *
         * config 파일에 있는 제외 경로에 걸린다면 정상 작동,
         * 인증이 필요한 경로에 걸린다면 401 에러 발생.
         */
        if (!StringUtils.hasText(authHeader)) {
            filterChain.doFilter(request, response);
            return;
        }

        /**
         * 인증을 받기위해 인증 받지 않은 Authentication 객체 생성
         * principal에 authHeader 적재.
         */
        Authentication unAuth = makeUnAuthToken(authHeader);

        // provider로 인증.
        Authentication authenticated = provider.authenticate(unAuth);

        // 인증된 Authentication 객체 context holder에 적재.
        SecurityContextHolder.getContext().setAuthentication(authenticated);
        filterChain.doFilter(request, response);
    }

    private Authentication makeUnAuthToken(String data) {
        return new UsernamePasswordAuthenticationToken(data, null);
    }
}
