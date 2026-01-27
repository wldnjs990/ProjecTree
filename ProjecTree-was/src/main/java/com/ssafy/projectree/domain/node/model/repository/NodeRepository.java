package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.repository.custom.NodeRepositoryCustom;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface NodeRepository extends JpaRepository<Node, Long>, NodeRepositoryCustom {
	@Query("SELECT TYPE(n) FROM Node n WHERE n.id = :nodeId")
	Optional<Class<? extends Node>> findNodeTypeById(@Param("nodeId") Long nodeId);
}
