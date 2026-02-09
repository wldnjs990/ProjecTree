package com.ssafy.projectree.domain.node.model.entity;

import com.ssafy.projectree.domain.node.enums.NodeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "advance_node")
@PrimaryKeyJoinColumn(name = "node_id")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@DiscriminatorValue("ADVANCE")
public class AdvanceNode extends Node{
	private Integer difficult;

	@Column(columnDefinition = "TEXT")
	private String comparison;

	@Override
	public NodeType getNodeType() {
		return NodeType.ADVANCE;
	}

	@Override
	public int getCandidateLimit() {
		return 0;
	}
}
