package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.auth.api.dto.SignUpDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Auth", description = "Auth 관련 API")
public interface AuthDocsController {

    @Operation(
            summary = "회원 가입",
            description = "GUEST 권한의 회원을 USER 권한으로 승격시키고, 추가 정보를 입력받아 회원가입을 완료합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Successfully Created",
                    headers = @Header(name = "Set-Cookie", description = "RefreshToken 쿠키 설정 (HttpOnly, Secure)"),
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                                "message": "Successfully Created",
                                                "isSuccess": true,
                                                "data": {
                                                    "accessToken": "ey..."
                                                },
                                                "code": 201
                                            }
                                            """
                            )
                    )
            )
    })
    @PatchMapping("/members/signup")
    CommonResponse<SignUpDto.Response> signUp(
            @Parameter(hidden = true) @AuthenticationPrincipal Member principal,
            @RequestBody SignUpDto.Request requestDto,
            @Parameter(hidden = true) HttpServletResponse response
    );

    @Operation(
            summary = "Token 재발급",
            description = "RefreshToken을 이용하여 AccessToken과 RefreshToken을 재발급합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Successfully Reissued",
                    headers = @Header(name = "Set-Cookie", description = "새로운 RefreshToken 쿠키 설정 (HttpOnly, Secure)"),
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                                "message": "Successfully Completed",
                                                "isSuccess": true,
                                                "data": {
                                                    "accessToken": "ey..."
                                                },
                                                "code": 200
                                            }
                                            """
                            )
                    )
            )
    })
    @PostMapping("/refresh")
    CommonResponse<SignUpDto.Response> refresh(
            @Parameter(description = "쿠키에 저장된 RefreshToken", required = true) @CookieValue("refreshToken") String refreshToken,
            @Parameter(hidden = true) HttpServletResponse response
    );
}