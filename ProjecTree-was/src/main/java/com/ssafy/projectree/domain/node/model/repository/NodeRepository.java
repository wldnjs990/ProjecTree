package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.repository.custom.NodeRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NodeRepository extends JpaRepository<Node, Long>, NodeRepositoryCustom {
}
