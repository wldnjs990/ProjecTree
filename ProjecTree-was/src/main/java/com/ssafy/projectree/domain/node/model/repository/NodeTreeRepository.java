package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.model.entity.NodeTree;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.domain.node.model.entity.key.NodeTreeId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NodeTreeRepository extends JpaRepository<NodeTree, NodeTreeId> {

	//현재 노드ID를 입력받아 최상위 루트노드(프로젝트 노드)를 찾는 쿼리
	@Query("SELECT TREAT(nt.ancestor AS ProjectNode) " +
			"FROM NodeTree nt " +
			"WHERE nt.descendant.id = :descendantId " +
			"ORDER BY nt.depth DESC")
	List<ProjectNode> findRoot(@Param("descendantId") Long descendantId, Pageable pageable);
}
