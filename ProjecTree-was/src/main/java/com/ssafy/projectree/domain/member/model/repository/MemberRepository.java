package com.ssafy.projectree.domain.member.model.repository;

import com.ssafy.projectree.domain.member.model.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MemberRepository extends JpaRepository<Member,Long> {
}
