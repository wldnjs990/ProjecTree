package com.ssafy.projectree.domain.auth.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtExceptionFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            // 다음 필터(JwtAuthenticationFilter)로 진행
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            // 1. 토큰 만료 시 처리
            setErrorResponse(response, ErrorCode.TOKEN_EXPIRED);
        } catch (MalformedJwtException e) {
            // 2. 토큰 구조가 이상할 때 (위조 등)
            setErrorResponse(response, ErrorCode.TOKEN_MALFORMED);
        } catch (SignatureException e) {
            // 3. 서명이 안 맞을 때
            setErrorResponse(response, ErrorCode.TOKEN_INVALID_SIGNATURE);
        } catch (IllegalArgumentException e) {
            // 4. 토큰이 없는 경우 등
            setErrorResponse(response, ErrorCode.TOKEN_EMPTY);
        } catch (BadCredentialsException | InsufficientAuthenticationException e) {
            // 인증 실패
            setErrorResponse(response, ErrorCode.AUTHENTICATION_REQUIRED);

        } catch (AccessDeniedException e) {
            // 권한 부족
            setErrorResponse(response, ErrorCode.ACCESS_DENIED);

        } catch (JwtException e) {
            // 5. 그 외 JWT 관련 에러
            setErrorResponse(response, ErrorCode.UN_EXPECTED_TOKEN_VALIDATION);
        }
    }

    private void setErrorResponse(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(
                CommonResponse.fail(errorCode, errorCode.getDefaultMessage())
        ));
    }
}
