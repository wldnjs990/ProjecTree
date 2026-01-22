package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.member.api.dto.MemberEmailReadDto;
import com.ssafy.projectree.domain.member.api.dto.MemberNicknameUpdateDto;
import com.ssafy.projectree.domain.member.api.dto.MemberReadDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Member", description = "Member 관련 API")
public interface MemberDocsController {

    @Operation(
            summary = "회원 이메일 조회",
            description = "회원 ID를 통해 해당 회원의 이메일 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content
            )
    })
    @GetMapping("/members/{id}/email")
    CommonResponse<MemberEmailReadDto.Response> getMemberEmail(@PathVariable Long id);

    @Operation(
            summary = "닉네임 중복 확인",
            description = "입력한 닉네임이 이미 사용 중인지 확인합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content
            )
    })
    @GetMapping("/members/nickname-check")
    CommonResponse<MemberReadDto.Response> checkNicknameCheck(@RequestParam String nickname);

    @Operation(
            summary = "닉네임 변경",
            description = "회원의 닉네임을 변경합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Updated",
                    content = @Content
            )
    })
    @PutMapping("/members/{id}/nickname")
    CommonResponse<MemberNicknameUpdateDto.Response> updateMemberNickname(@PathVariable Long id, MemberNicknameUpdateDto.Request request);

    @Operation(
            summary = "회원 정보 조회",
            description = "회원의 기본 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Completed",
                    content = @Content
            )
    })
    @GetMapping("/members/{id}")
    CommonResponse<MemberReadDto.Response> getMemberDetail(@PathVariable Long id);

    @Operation(
            summary = "회원 탈퇴",
            description = "회원 계정을 삭제합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Removed"
            )
    })
    @DeleteMapping("/members/{id}")
    CommonResponse<Void> deleteMember(@PathVariable Long id);
}
