package com.ssafy.projectree.domain.node.model.repository.custom;

import com.ssafy.projectree.domain.node.model.entity.Node;

public interface NodeRepositoryCustom {

	//하위 3개는 모두 계층 관계 저장을 위한 메서드
	void addPath(Long parentId, Node child);
	void addPath(Long parentId, Long childId);
	void addPath(Node parent, Node child);
	//해당 메서드는 계층 관계 저장과 child노드까지 함께 저장
	void saveWithParent(Long parentId, Node child);
	void saveRoot(Node root);
}
