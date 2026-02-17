package com.ssafy.projectree.domain.porfolio.model.repositroy;

import com.ssafy.projectree.domain.porfolio.model.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    @Query("""
    SELECT p
    FROM Portfolio p
    WHERE p.member.id = :memberId
    AND p.workspace.id = :workspaceId
    """)
    Optional<Portfolio> findByWorkspaceIdAndMemberId(Long memberId, Long workspaceId);
}
