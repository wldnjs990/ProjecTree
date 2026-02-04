package com.ssafy.projectree.domain.tech.model.repository;

import com.ssafy.projectree.domain.tech.model.entity.WorkspaceTechStack;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorkspaceTechStackRepository extends JpaRepository<WorkspaceTechStack, Long> {

    @Query("""
    SELECT tv.name
    FROM WorkspaceTechStack wt
    JOIN wt.techVocabulary tv
    WHERE wt.workspace = :workspace
""")
    List<String> findTechNamesByWorkspace(@Param("workspace") Workspace workspace);
}
