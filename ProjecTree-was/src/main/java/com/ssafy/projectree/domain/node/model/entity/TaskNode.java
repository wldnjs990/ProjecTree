package com.ssafy.projectree.domain.node.model.entity;

import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.TaskType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "task_node")
@PrimaryKeyJoinColumn(name = "node_id")
@Getter
@Setter
public class TaskNode extends Node{
	private Integer difficult;

	@Enumerated(EnumType.STRING)
	private TaskType type;

	@Column(columnDefinition = "TEXT")
	private String comparison;

	@Override
	public NodeType getNodeType() {
		return NodeType.TASK;
	}

	@Override
	public int getCandidateLimit() {
		return 0;
	}
}
