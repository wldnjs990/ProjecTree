package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@Tag(name = "ErrorCode", description = "에러코드 목록 조회")
public class ErrorCodeDocsController {


    @GetMapping("/error-codes")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    public List<ErrorCodeResponse> getCode() {
        return Arrays.stream(ErrorCode.values()).map(code ->
                        ErrorCodeResponse.builder().code(code.status()).description(code.getDefaultMessage()).build())
                .toList();
    }
}
