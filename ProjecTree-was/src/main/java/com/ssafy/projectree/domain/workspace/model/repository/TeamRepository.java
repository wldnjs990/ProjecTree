package com.ssafy.projectree.domain.workspace.model.repository;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.model.entity.Team;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    @Query("SELECT COUNT(t) FROM Team t WHERE t.workspace.id = :workspaceId")
    int getMemberCountByWorkspaceId(Long id);

    List<Team> findAllByMember(Member member);

    Optional<Team> findByWorkspaceAndMember(Workspace workspace, Member member);

    @Query("""
    select count(t) > 0
    from Team t
    where t.workspace = :workspace
    and t.member = :member
    """)
    boolean isParticipant(@Param("workspace") Workspace workspace, @Param("member") Member member);

}
