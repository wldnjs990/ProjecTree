package com.ssafy.projectree.domain.member.usecase;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    // TODO: 예외 발생에 대한 처리 필요
    public Member findById(Long id) {
        return memberRepository.findById(id).get();
    }

    // TODO: 예외 발생에 대한 처리 필요
    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email).get();
    }

}
