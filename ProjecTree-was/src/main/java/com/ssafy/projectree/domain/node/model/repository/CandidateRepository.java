package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.model.entity.Candidate;
import com.ssafy.projectree.domain.node.model.entity.Node;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    List<Candidate> findByParent(Node parent);

}
