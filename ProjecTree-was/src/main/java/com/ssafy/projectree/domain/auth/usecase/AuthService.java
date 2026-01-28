package com.ssafy.projectree.domain.auth.usecase;

import com.ssafy.projectree.domain.auth.enums.AuthRole;
import com.ssafy.projectree.domain.auth.jwt.Jwt;
import com.ssafy.projectree.domain.auth.jwt.JwtUtils;
import com.ssafy.projectree.domain.auth.api.dto.SignUpDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final MemberRepository memberRepository;
    private final JwtUtils jwtUtils;
    public Member signUp(Long id, SignUpDto.Request requestDto) {
        Member member = memberRepository.findById(id).orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR, "OAuth2 인증이 되지않은 사용자입니다. OAuth2 인증 후 시도해주세요."));
        member.setNickname(requestDto.getNickname());
        member.setRole(AuthRole.ROLE_USER);
        return memberRepository.save(member);
    }

    public Jwt refresh(String refreshToken) {
        //TODO : Redis Cache에서 블랙리스트 관리 로직 추가
        Member member = jwtUtils.resolveRefreshToken(refreshToken);
        return jwtUtils.generate(new UsernamePasswordAuthenticationToken(member, null, member.getAuthorities()));
    }
}
