package com.ssafy.projectree.global.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "OAuth2", description = "OAuth2 소셜 로그인 API")
@RestController
public class OAuth2DocsController {

    @Operation(summary = "Google 로그인", description = "Google 소셜 로그인을 진행합니다.")
    @ApiResponse(responseCode = "302", description = "Google 로그인 페이지로 리다이렉트")
    @GetMapping("/oauth2/authorization/google")
    public void googleLogin() {
    }

    @Operation(summary = "GitHub 로그인", description = "GitHub 소셜 로그인을 진행합니다.")
    @ApiResponse(responseCode = "302", description = "GitHub 로그인 페이지로 리다이렉트")
    @GetMapping("/oauth2/authorization/github")
    public void githubLogin() {
    }
}