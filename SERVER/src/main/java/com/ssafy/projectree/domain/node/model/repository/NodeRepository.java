package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.api.dto.schema.NodeWithParentSchema;
import com.ssafy.projectree.domain.node.model.entity.AdvanceNode;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.TaskNode;
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

    @Query("""
                SELECT tn
                FROM TaskNode tn
                JOIN NodeTree nt ON tn.id = nt.descendant.id
                JOIN ProjectNode pn ON nt.ancestor.id = pn.id
                WHERE pn.workspace.id = :workspaceId
                AND tn.member.id = :memberId
                AND tn.status = 'DONE'
                AND tn.deletedAt IS NULL
            """)
    List<TaskNode> findTaskNodesByWorkspaceAndMember(@Param("workspaceId") Long workspaceId, @Param("memberId") Long memberId);

    @Query("""
                SELECT an
                FROM AdvanceNode an
                JOIN NodeTree nt ON an.id = nt.descendant.id
                JOIN ProjectNode pn ON nt.ancestor.id = pn.id
                WHERE pn.workspace.id = :workspaceId
                AND an.member.id = :memberId
                AND an.status = 'DONE'
                AND an.deletedAt IS NULL
            """)
    List<AdvanceNode> findAdvanceNodesByWorkspaceAndMember(@Param("workspaceId") Long workspaceId, @Param("memberId") Long memberId);

    @Modifying
    @Query("""
            update Node n
            set n.xPos = :x,
            n.yPos = :y
            where n.id = :id
            """)
    void updatePosition(Long id, double x, double y);


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
                    AND pn.deletedAt IS NULL 
                )
                AND n.deletedAt IS NULL 
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
