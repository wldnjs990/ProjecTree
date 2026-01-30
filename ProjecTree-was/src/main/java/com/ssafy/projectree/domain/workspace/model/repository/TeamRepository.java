package com.ssafy.projectree.domain.workspace.model.repository;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.model.entity.Team;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TeamRepository extends JpaRepository<Team, Long> {

    int getMemberCountByWorkspaceId(Long id);

    @Query("""
    select count(t) > 0
    from Team t
    where t.workspace = :workspace
    and t.member = :member
    """)
    boolean isParticipant(@Param("workspace") Workspace workspace, @Param("member") Member member);

}
