package com.ssafy.projectree.domain.workspace.model.repository;

import com.ssafy.projectree.domain.workspace.model.entity.FunctionSpecification;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FunctionSpecificationRepository extends JpaRepository<FunctionSpecification, Long> {

    List<FunctionSpecification> findAllByWorkspace(Workspace workspace);

}
