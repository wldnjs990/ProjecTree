package com.ssafy.projectree.domain.tech.model.repository;

import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.tech.model.entity.NodeTechStack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NodeTechStackRepository extends JpaRepository<NodeTechStack, Long> {
    List<NodeTechStack> findAllByNode(Node node);
}
