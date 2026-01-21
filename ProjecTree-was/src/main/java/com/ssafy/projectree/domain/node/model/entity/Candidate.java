package com.ssafy.projectree.domain.node.model.entity;

import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "node_id", nullable = false)
	private Node node;

	@OneToOne
	@JoinColumn(name = "derivation_node_id", nullable = true)
	private Node derivationNode;

	@Column(columnDefinition = "VARCHAR(30)")
	private String name;

	@Column(columnDefinition = "TEXT")
	private String description;

	private boolean isSelected;

}
