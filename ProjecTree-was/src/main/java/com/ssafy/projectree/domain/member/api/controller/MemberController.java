package com.ssafy.projectree.domain.member.api.controller;

import com.ssafy.projectree.domain.member.api.dto.MemberEmailReadDto;
import com.ssafy.projectree.domain.member.api.dto.MemberNicknameReadDto;
import com.ssafy.projectree.domain.member.api.dto.MemberNicknameUpdateDto;
import com.ssafy.projectree.domain.member.api.dto.MemberReadDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.usecase.MemberService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.MemberDocsController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MemberController implements MemberDocsController {

    private final MemberService memberService;

    @GetMapping("/members/me/email")
    public CommonResponse<MemberEmailReadDto.Response> getMemberEmail(@AuthenticationPrincipal Member principal) {
        return CommonResponse.success(SuccessCode.SUCCESS, memberService.getMemberEmail(principal.getId()));
    }

    @GetMapping("/members/nickname-check")
    public CommonResponse<MemberNicknameReadDto.Response> checkNicknameCheck(@RequestParam String nickname) {
        return CommonResponse.success(SuccessCode.SUCCESS, memberService.existsByNickname(nickname));
    }

    @PutMapping("/members/me/nickname")
    public CommonResponse<MemberNicknameUpdateDto.Response> updateMemberNickname(@AuthenticationPrincipal Member principal, MemberNicknameUpdateDto.Request request) {
        return CommonResponse.success(SuccessCode.UPDATED, memberService.updateMemberByNickname(principal.getId(), request.getNickname()));
    }

    @GetMapping("/members/me")
    public CommonResponse<MemberReadDto.Response> getMemberDetail(@AuthenticationPrincipal Member principal) {
        return CommonResponse.success(SuccessCode.SUCCESS, memberService.getMemberById(principal.getId()));
    }

    @DeleteMapping("/members/me")
    public CommonResponse<Void> deleteMember(@AuthenticationPrincipal Member principal) {
        memberService.deleteMember(principal.getId());
        return CommonResponse.success(SuccessCode.REMOVED, null);
    }
}
