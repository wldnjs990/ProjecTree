package com.ssafy.projectree.domain.auth.api.controller;

import com.ssafy.projectree.domain.auth.jwt.Jwt;
import com.ssafy.projectree.domain.auth.jwt.JwtProvider;
import com.ssafy.projectree.domain.auth.usecase.AuthService;
import com.ssafy.projectree.domain.auth.utils.AuthHash;
import com.ssafy.projectree.domain.auth.utils.CookieUtils;
import com.ssafy.projectree.domain.auth.api.dto.SignUpDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.usecase.MemberService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.AuthDocsController;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController implements AuthDocsController {
    private final AuthService authService;
    private final JwtProvider jwtProvider;
    private final AuthHash authHash;
    private final CookieUtils cookieUtils;

    @PatchMapping("/members/signup")
    public CommonResponse<SignUpDto.Response> signUp(
            @AuthenticationPrincipal Member principal, // SecurityContext에 저장된 GUEST 유저 정보
            @RequestBody SignUpDto.Request requestDto,
            HttpServletResponse response
    ) {
        Member member = authService.signUp(principal.getId(), requestDto);
        Jwt jwt = jwtProvider.generate(member);
        Cookie cookie = CookieUtils.createRefreshTokenCookie(jwt.getRefreshToken());
        response.addCookie(cookie);
        return CommonResponse.success(SuccessCode.CREATED, new SignUpDto.Response(jwt.getAccessToken()));
    }

    @PostMapping("/refresh")
    public CommonResponse<SignUpDto.Response> refresh(@CookieValue("refreshToken") String refreshToken,
                                                      HttpServletResponse response
    ){
        Jwt jwt = authService.refresh(refreshToken);
        Cookie cookie = CookieUtils.createRefreshTokenCookie(jwt.getRefreshToken());
        response.addCookie(cookie);
        return CommonResponse.success(SuccessCode.CREATED, new SignUpDto.Response(jwt.getRefreshToken()));
    }

    @GetMapping("/token")
    public CommonResponse<SignUpDto.Response> publishToken(@RequestParam("code") String code,
                                                           HttpServletResponse resposne) {
        Jwt jwt = authHash.take(code);
        Cookie cookie = CookieUtils.createRefreshTokenCookie(jwt.getRefreshToken());
        resposne.addCookie(cookie);
        return CommonResponse.success(SuccessCode.SUCCESS, new SignUpDto.Response(jwt.getAccessToken()));
    }
}
