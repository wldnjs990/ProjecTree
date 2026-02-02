package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.model.entity.Candidate;
import com.ssafy.projectree.domain.node.model.entity.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    List<Candidate> findByParent(Node parent);

    @Modifying
    @Query("""
             update Candidate c 
             set c.deletedAt = CURRENT_TIMESTAMP
             where c.parent.id = :parentId
            """)
    void deleteByParentId(Long parentId);
}
