package com.ssafy.projectree.domain.node.model.entity;

import com.ssafy.projectree.domain.node.model.entity.key.NodeTreeId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Tri
public class NodeTree{
	@EmbeddedId
	private NodeTreeId id;

	// 조상 노드 (추상 클래스 Node를 참조하여 모든 하위 타입 수용 가능)
	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("ancestorId")
	@JoinColumn(name = "ancestor_id")
	private Node ancestor;

	// 자손 노드
	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("descendantId")
	@JoinColumn(name = "descendant_id")
	private Node descendant;

	// 조상과 자손 사이의 거리 (0: 본인, 1: 직계 자식...)
	private Integer depth;

	@Builder
	public NodeTree(Node ancestor, Node descendant, Integer depth) {
		this.id = new NodeTreeId(ancestor.getId(), descendant.getId());
		this.ancestor = ancestor;
		this.descendant = descendant;
		this.depth = depth;
	}
}
