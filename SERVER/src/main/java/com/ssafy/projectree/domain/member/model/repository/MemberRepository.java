package com.ssafy.projectree.domain.member.model.repository;

import com.ssafy.projectree.domain.member.model.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member,Long> {

    Optional<Member> findByEmail(String email);

    @Query(value = "SELECT m.email FROM Member m WHERE m.id = :id")
    Optional<String> findEmailById(Long id);

    boolean existsByNickname(String nickname);}
