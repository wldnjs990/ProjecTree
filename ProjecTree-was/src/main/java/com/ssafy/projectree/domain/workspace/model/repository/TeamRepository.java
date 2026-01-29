package com.ssafy.projectree.domain.workspace.model.repository;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.model.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {

    int getMemberCountByWorkspaceId(Long id);

    List<Team> findAllByMember(Member member);

}
