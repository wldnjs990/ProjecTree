package com.ssafy.projectree.domain.tech.model.repository;

import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.tech.model.entity.NodeTechStack;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NodeTechStackRepository extends JpaRepository<NodeTechStack, Long> {
    List<NodeTechStack> findAllByNode(Node node);

    @Modifying(clearAutomatically = true)
    @Query("""
        update TechStackInfo tsi
        set tsi.isSelected = false
        where tsi.id in (
            select nts.techStackInfo.id
            from NodeTechStack nts
            where nts.node.id = :nodeId
        )
    """)
    void unselectAllByNodeId(@Param("nodeId") Long nodeId);
}
