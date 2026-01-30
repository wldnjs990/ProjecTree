package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.api.dto.schema.NodeWithParentSchema;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.repository.custom.NodeRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
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



    @Query("""
                SELECT 
                    n.id as id,
                    n.name as name,
                    TYPE(n) as nodeType,
                    n.status as status,
                    n.identifier as identifier,
                    n.priority as priority,
                    n.xPos as xPos,
                    n.yPos as yPos,
                    nt.ancestor.id as parentId,  
                    COALESCE( tn.difficult, an.difficult) as difficult,   
                    tn.type as taskType
                FROM Node n
                LEFT JOIN NodeTree nt 
                    ON n.id = nt.descendant.id 
                    AND nt.depth = 1         
                LEFT JOIN TaskNode tn 
                    ON n.id = tn.id
                LEFT JOIN AdvanceNode an
                    on n.id = an.id
                    
                WHERE n.id IN (
                    SELECT child.descendant.id
                    FROM NodeTree child
                    JOIN ProjectNode pn ON child.ancestor.id = pn.id
                    WHERE pn.workspace.id = :workspaceId
                )
            """)
    List<NodeWithParentSchema> findAllFlatNodesByWorkspace(@Param("workspaceId") Long workspaceId);


    @Modifying(clearAutomatically = true)
    @Query("""
                update Node n
                set n.deletedAt = CURRENT_TIMESTAMP
                where n.id in (
                    select nt.descendant.id
                    from NodeTree nt
                    where nt.ancestor.id = :nodeId
                )
            """)
    void deleteNodeAndDescendants(@Param("nodeId") Long nodeId);


}
