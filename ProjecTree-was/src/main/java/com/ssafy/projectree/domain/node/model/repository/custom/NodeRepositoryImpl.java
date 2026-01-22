package com.ssafy.projectree.domain.node.model.repository.custom;

import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.NodeTree;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

public class NodeRepositoryImpl implements NodeRepositoryCustom {

	@PersistenceContext
	private EntityManager em;

	@Override
	public void addPath(Long parentId, Node child) {
		addPath(parentId, child.getId());
	}

	@Override
	public void addPath(Long parentId, Long childId) {
		Node childProxy = em.getReference(Node.class, childId);

		//자기 자신의 연결정보를 추가(depth 0)
		NodeTree selfPath = new NodeTree(childProxy, childProxy, 0);
		em.persist(selfPath);

		String jpql = """
            INSERT INTO NodeTree (ancestor, descendant, depth)
            SELECT nt.ancestor, :child, nt.depth + 1
            FROM NodeTree nt
            WHERE nt.descendant.id = :parentId
        """;
		em.createQuery(jpql)
				.setParameter("child", childProxy) // 여기도 프록시를 넘기면 FK로 변환됨
				.setParameter("parentId", parentId)
				.executeUpdate();
	}

	@Override
	public void addPath(Node parent, Node child) {
		addPath(parent.getId(), child.getId());
	}

	@Override
	public void saveWithParent(Long parentId, Node child) {
		em.persist(child);
		addPath(parentId, child.getId());
	}

	@Override
	public void saveRoot(Node root) {
		em.persist(root);
		em.persist(new NodeTree(root, root, 0));
	}
}
