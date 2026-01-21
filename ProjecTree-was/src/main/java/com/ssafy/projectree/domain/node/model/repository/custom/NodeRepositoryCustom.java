package com.ssafy.projectree.domain.node.model.repository.custom;

import com.ssafy.projectree.domain.node.model.entity.Node;

public interface NodeRepositoryCustom {

	void addPath(Long parentId, Node child);
	void addPath(Long parentId, Long childId);
	void addPath(Node parent, Node child);

}
