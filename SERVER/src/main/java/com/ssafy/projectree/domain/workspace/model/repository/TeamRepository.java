package com.ssafy.projectree.domain.workspace.model.repository;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.model.entity.Team;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import io.lettuce.core.dynamic.annotation.Param;
import org.hibernate.jdbc.Work;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    int countByWorkspace(Workspace workspace);

    List<Team> findAllByMember(Member member);

    Optional<Team> findByWorkspaceAndMember(Workspace workspace, Member member);

    @Query("""
    select count(t) > 0
    from Team t
    where t.workspace = :workspace
    and t.member = :member
    """)
    boolean isParticipant(@Param("workspace") Workspace workspace, @Param("member") Member member);

    Optional<List<Team>> findByWorkspace(Workspace workspace);
}
