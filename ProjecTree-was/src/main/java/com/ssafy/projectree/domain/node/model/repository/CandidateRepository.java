package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.model.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
}
