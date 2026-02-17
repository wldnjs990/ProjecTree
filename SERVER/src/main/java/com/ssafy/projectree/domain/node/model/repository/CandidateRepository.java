package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.model.entity.Candidate;
import com.ssafy.projectree.domain.node.model.entity.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {


    @Modifying(clearAutomatically = true)
    @Query("""
             update Candidate c 
             set c.deletedAt = CURRENT_TIMESTAMP
             where c.parent.id = :parentId
            """)
    void deleteByParentId(Long parentId);

    @Modifying(clearAutomatically = true)
    @Query("""
        update Candidate c
        set c.isSelected = false, c.derivationNode = null
        where c.derivationNode.id = :nodeId 
    """)
    void disConnectDerivation(Long nodeId);

    List<Candidate> findByParent(Node parent);

    double countCandidateByParent(Node parent);
}
