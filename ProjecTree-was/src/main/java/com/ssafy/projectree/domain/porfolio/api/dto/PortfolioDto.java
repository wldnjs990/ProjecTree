package com.ssafy.projectree.domain.porfolio.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class PortfolioDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "PortfolioGetDto.Request")
    public static class Request{
        private Long id;
        private String content;
    }
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "PortfolioGetDto.Response")
    public static class Response{
        private Long id;
        private String content;
    }
}
