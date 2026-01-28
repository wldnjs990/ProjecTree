package com.ssafy.projectree.domain.member.api.controller;

import com.ssafy.projectree.domain.auth.jwt.JwtProvider;
import com.ssafy.projectree.domain.member.api.dto.MemberEmailReadDto;
import com.ssafy.projectree.domain.member.api.dto.MemberNicknameUpdateDto;
import com.ssafy.projectree.domain.member.api.dto.MemberReadDto;
import com.ssafy.projectree.domain.member.usecase.MemberService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.MemberDocsController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MemberController implements MemberDocsController {

    // TODO: JWT 추가시 PathVariable 수정 필요
    private final JwtProvider jwtProvider;
    private final MemberService memberService;


    @GetMapping("/members/{id}/email")
    public CommonResponse<MemberEmailReadDto.Response> getMemberEmail(@PathVariable Long id) {

        return CommonResponse.success(SuccessCode.SUCCESS, null);
    }

    @GetMapping("/members/nickname-check")
    public CommonResponse<MemberReadDto.Response> checkNicknameCheck(@RequestParam String nickname) {

        return CommonResponse.success(SuccessCode.SUCCESS, null);
    }

    @PutMapping("/members/{id}/nickname")
    public CommonResponse<MemberNicknameUpdateDto.Response> updateMemberNickname(@PathVariable Long id, MemberNicknameUpdateDto.Request request) {

        return CommonResponse.success(SuccessCode.UPDATED, null);
    }

    @GetMapping("/members/{id}")
    public CommonResponse<MemberReadDto.Response> getMemberDetail(@PathVariable Long id) {

        return CommonResponse.success(SuccessCode.SUCCESS, null);
    }

    @DeleteMapping("/members/{id}")
    public CommonResponse<Void> deleteMember(@PathVariable Long id) {

        return CommonResponse.success(SuccessCode.REMOVED, null);
    }
}
