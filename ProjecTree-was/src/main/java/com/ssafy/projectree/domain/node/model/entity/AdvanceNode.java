package com.ssafy.projectree.domain.node.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "advance_node")
@PrimaryKeyJoinColumn(name = "node_id")
@Getter
@Setter
public class AdvanceNode extends Node{
	private Integer difficult;

	@Column(columnDefinition = "TEXT")
	private String comparison;
}
