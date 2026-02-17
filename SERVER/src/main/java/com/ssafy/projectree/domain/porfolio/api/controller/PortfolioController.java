package com.ssafy.projectree.domain.porfolio.api.controller;

import com.ssafy.projectree.domain.porfolio.api.dto.PortfolioDto;
import com.ssafy.projectree.domain.porfolio.usecase.PortfolioService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.PortfolioDocsController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PortfolioController implements PortfolioDocsController {

    private final PortfolioService portfolioService;

    //워크스페이스 별 로그인 중인 사용자의 포트폴리오 조회
    @Override
    @GetMapping("/workspaces/{workspace-id}/portfolio")
    public CommonResponse<PortfolioDto.Response> getPortfolio(@PathVariable(name = "workspace-id") Long workspaceId){
        return CommonResponse.success(SuccessCode.SUCCESS, portfolioService.findPortfolio(workspaceId));
    }

    @Override
    @PatchMapping("/workspaces/portfolio")
    public CommonResponse<PortfolioDto.Response> modifyPortfolio(
            @RequestBody PortfolioDto.Request request){
        return CommonResponse.success(SuccessCode.SUCCESS, portfolioService.modifyPortfolio(request));
    }

    @Override
    @PostMapping("/workspaces/{workspace-id}/portfolio")
    public CommonResponse<PortfolioDto.Response> generatePortfolio(
            @PathVariable("workspace-id") Long workspaceId){
        return CommonResponse.success(SuccessCode.SUCCESS, portfolioService.generatePortfolio(workspaceId));
    }
}
