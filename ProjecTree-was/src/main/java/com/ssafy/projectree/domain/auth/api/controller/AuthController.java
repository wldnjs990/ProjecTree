package com.ssafy.projectree.domain.auth.api.controller;

import com.ssafy.projectree.domain.auth.jwt.Jwt;
import com.ssafy.projectree.domain.auth.jwt.JwtProvider;
import com.ssafy.projectree.domain.auth.usecase.AuthService;
import com.ssafy.projectree.domain.member.api.dto.SignUpDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.AuthDocsController;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.ssafy.projectree.domain.auth.jwt.JwtProperties.REFRESH_TOKEN_EXPIRE_TIME;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController implements AuthDocsController {
    private final AuthService authService;
    private final JwtProvider jwtProvider;

    @PatchMapping("/members/signup")
    public CommonResponse<SignUpDto.Response> signUp(
            @AuthenticationPrincipal Member principal, // SecurityContext에 저장된 GUEST 유저 정보
            @RequestBody SignUpDto.Request requestDto,
            HttpServletResponse response
    ) {
        Member member = authService.signUp(principal.getId(), requestDto);
        Jwt jwt = jwtProvider.generate(member);
        Cookie cookie = new Cookie("refreshToken", jwt.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge((int) REFRESH_TOKEN_EXPIRE_TIME);
        response.addCookie(cookie);
        return CommonResponse.success(SuccessCode.CREATED, new SignUpDto.Response(jwt.getAccessToken()));
    }
}
