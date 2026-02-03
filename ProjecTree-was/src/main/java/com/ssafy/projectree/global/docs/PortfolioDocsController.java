package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.porfolio.api.dto.PortfolioDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Portfolio", description = "포트폴리오 관련 API")
public interface PortfolioDocsController {

    @Operation(
            summary = "포트폴리오 조회",
            description = "워크스페이스 별 로그인 중인 사용자의 포트폴리오를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    CommonResponse<PortfolioDto.Response> getPortfolio(
            @Parameter(description = "워크스페이스 ID", example = "1")
            @PathVariable(name = "workspace-id") Long workspaceId
    );

    @Operation(
            summary = "포트폴리오 수정",
            description = "포트폴리오 내용을 수정합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "수정 성공")
    })
    CommonResponse<PortfolioDto.Response> modifyPortfolio(
            @RequestBody PortfolioDto.Request request
    );

    @Operation(
            summary = "포트폴리오 생성",
            description = "AI를 사용하여 워크스페이스의 내용을 바탕으로 포트폴리오를 생성합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "생성 성공")
    })
    CommonResponse<PortfolioDto.Response> generatePortfolio(
            @Parameter(description = "워크스페이스 ID", example = "1")
            @PathVariable("workspace-id") Long workspaceId
    );
}
