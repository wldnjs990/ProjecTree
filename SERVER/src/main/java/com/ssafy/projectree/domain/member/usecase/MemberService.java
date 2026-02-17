package com.ssafy.projectree.domain.member.usecase;

import com.ssafy.projectree.domain.member.api.dto.MemberEmailReadDto;
import com.ssafy.projectree.domain.member.api.dto.MemberNicknameReadDto;
import com.ssafy.projectree.domain.member.api.dto.MemberNicknameUpdateDto;
import com.ssafy.projectree.domain.member.api.dto.MemberReadDto;
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

    public Member findById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR));
    }

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR));
    }

    public MemberEmailReadDto.Response getMemberEmail(Long id) {
        String email = memberRepository.findEmailById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR));

        return MemberEmailReadDto.Response.builder()
                .email(email)
                .build();
    }

    public MemberNicknameReadDto.Response existsByNickname(String nickname) {
        return MemberNicknameReadDto.Response.builder()
                .isExist(memberRepository.existsByNickname(nickname))
                .build();
    }

    @Transactional
    public MemberNicknameUpdateDto.Response updateMemberByNickname(Long memberId, String nickname) {
        if (memberRepository.existsByNickname(nickname)) {
            throw new BusinessLogicException(ErrorCode.NICKNAME_DUPLICATE_ERROR);
        }

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR));

        member.setNickname(nickname);

        return MemberNicknameUpdateDto.Response.builder()
                .nickname(member.getNickname())
                .build();
    }

    public MemberReadDto.Response getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR));
        return MemberReadDto.Response.builder()
                .nickname(member.getNickname())
                .name(member.getName())
                .email(member.getEmail())
                .build();
    }

    @Transactional
    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR));

        memberRepository.delete(member);
    }
}
