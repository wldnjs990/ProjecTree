package com.ssafy.projectree.domain.auth.filter;

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


@Component
@RequiredArgsConstructor
@Slf4j
public class InternalJwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtAuthenticationProvider provider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String requestUrl = request.getRequestURI();

        if (!requestUrl.startsWith("/api/internal")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (!StringUtils.hasText(authHeader)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Internal token required");
            return;
        }

        /**
         * 인증을 받기위해 인증 받지 않은 Authentication 객체 생성
         * principal에 authHeader 적재.
         */
        Authentication unAuth = makeUnAuthToken(authHeader);

        Authentication authenticated = provider.authenticate(unAuth);

        SecurityContextHolder.getContext().setAuthentication(authenticated);
        filterChain.doFilter(request, response);
    }

    private Authentication makeUnAuthToken(String data) {
        return new UsernamePasswordAuthenticationToken(data, null);
    }
}
