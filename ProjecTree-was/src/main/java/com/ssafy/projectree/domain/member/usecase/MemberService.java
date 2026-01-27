package com.ssafy.projectree.domain.member.usecase;

import com.ssafy.projectree.domain.auth.enums.AuthRole;
import com.ssafy.projectree.domain.member.api.dto.SignUpDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {
    private final MemberRepository memberRepository;
    public Member signUp(Long id, SignUpDto.Request requestDto) {
        Member member = memberRepository.findById(id).orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR, "OAuth2 인증이 되지않은 사용자입니다. OAuth2 인증 후 시도해주세요."));
        member.setNickname(requestDto.getNickname());
        member.setRole(AuthRole.ROLE_USER);
        return memberRepository.save(member);
    }
}
