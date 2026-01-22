package com.ssafy.projectree.domain.file.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class FileReadDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "FileReadDto.Response", description = "워크스페이스 내 등록된 파일 조회 응답 DTO")
    public static class Response {
        private Long id;
        @Schema(name = "AI여행_기능명세서.pdf", description = "사용자가 업로드한 파일명")
        private String orginFileName;
        @Schema(name = "application/pdf", description = "업로드 된 파일 타입")
        private String contentType;
        @Schema(name = "s3://testbucket/test/AI여행기능명세서.pdf")
        private String path;
        @Schema(name = "10042314", description = "파일 용량 byte 단위")
        private Long size;
    }

}
