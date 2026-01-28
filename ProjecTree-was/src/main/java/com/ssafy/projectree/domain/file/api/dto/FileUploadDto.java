package com.ssafy.projectree.domain.file.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

public class FileUploadDto {

    @Getter
    @AllArgsConstructor
    public static class Response {

        @Schema(description = "파일 업로드 후 응답 DTO", example = "파일 업로드에 성공하였습니다.")
        private String message;

        public static Response of(String message) {
            return new Response(message);
        }

    }

}
