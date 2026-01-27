package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.repository.custom.NodeRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface NodeRepository extends JpaRepository<Node, Long>, NodeRepositoryCustom {
    @Query("SELECT TYPE(n) FROM Node n WHERE n.id = :nodeId")
    Optional<Class<? extends Node>> findNodeTypeById(@Param("nodeId") Long nodeId);

    @Modifying
    @Query("""
            update Node n
            set n.xPos = :x,
            n.yPos = :y
            where n.id = :id
            """)
        // TODO workspaceId 값을 추가로 받게되면 주석 해제
        // and n.workspace.id = :workspaceId
    void updatePosition(Long id, /*Long workspaceId,*/ double x, double y);
}
