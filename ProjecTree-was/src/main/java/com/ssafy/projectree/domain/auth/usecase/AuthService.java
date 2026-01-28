package com.ssafy.projectree.domain.auth.usecase;

import com.ssafy.projectree.domain.auth.enums.AuthRole;
import com.ssafy.projectree.domain.member.api.dto.SignUpDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final MemberRepository memberRepository;

    public Member signUp(Long id, SignUpDto.Request requestDto) {
        Member member = memberRepository.findById(id).orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR, "OAuth2 인증이 되지않은 사용자입니다. OAuth2 인증 후 시도해주세요."));
        member.setNickname(requestDto.getNickname());
        member.setRole(AuthRole.ROLE_USER);
        return memberRepository.save(member);
    }

}
