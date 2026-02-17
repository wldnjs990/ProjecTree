package com.ssafy.projectree.domain.member.api.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class MemberRoleDto {


    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "MemberRoleDto.Request")
    public static class Request{
        private Long userId;
    }

    public static class Response{

    }

}
