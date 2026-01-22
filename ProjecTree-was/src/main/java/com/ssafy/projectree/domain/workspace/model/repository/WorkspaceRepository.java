package com.ssafy.projectree.domain.workspace.model.repository;

import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;


public interface WorkspaceRepository extends JpaRepository<Workspace,Long> {
}
