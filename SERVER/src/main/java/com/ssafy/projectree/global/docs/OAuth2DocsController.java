package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "OAuth2", description = "OAuth2 소셜 로그인 API")
@RestController
public class OAuth2DocsController {

    @Operation(summary = "Google 로그인", description = "Google 소셜 로그인을 진행합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "302", description = "Google 로그인 페이지로 리다이렉트"),
            @ApiResponse(responseCode = "200", description = "로그인 성공 (OAuth2SuccessHandler 응답)",
                    headers = @Header(name = "Set-Cookie", description = "RefreshToken 쿠키 설정 (HttpOnly, Secure)"),
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CommonResponse.class),
                            examples = @ExampleObject(value = """
                                    {
                                        "message": "OAuth2 로그인 성공",
                                        "isSuccess": true,
                                        "data": {
                                            "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
                                        },
                                        "code": 200
                                    }
                                    """)))
    })
    @GetMapping("/oauth2/authorization/google")
    public void googleLogin() {
    }

    @Operation(summary = "GitHub 로그인", description = "GitHub 소셜 로그인을 진행합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "302", description = "GitHub 로그인 페이지로 리다이렉트"),
            @ApiResponse(responseCode = "200", description = "로그인 성공 (OAuth2SuccessHandler 응답)",
                    headers = @Header(name = "Set-Cookie", description = "RefreshToken 쿠키 설정 (HttpOnly, Secure)"),
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CommonResponse.class),
                            examples = @ExampleObject(value = """
                                    {
                                        "message": "OAuth2 로그인 성공",
                                        "isSuccess": true,
                                        "data": {
                                            "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
                                        },
                                        "code": 200
                                    }
                                    """)))
    })
    @GetMapping("/oauth2/authorization/github")
    public void githubLogin() {
    }
}