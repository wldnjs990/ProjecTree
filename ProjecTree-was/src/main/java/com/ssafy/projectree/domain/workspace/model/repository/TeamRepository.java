package com.ssafy.projectree.domain.workspace.model.repository;

import com.ssafy.projectree.domain.workspace.model.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {

    int getMemberCountByWorkspaceId(Long id);

}
