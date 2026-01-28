package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.member.api.dto.SignUpDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
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
                    content = @Content
            )
    })
    @PatchMapping("/members/signup")
    CommonResponse<SignUpDto.Response> signUp(
            @Parameter(hidden = true) @AuthenticationPrincipal Member principal,
            @RequestBody SignUpDto.Request requestDto,
            @Parameter(hidden = true) HttpServletResponse response
    );
}