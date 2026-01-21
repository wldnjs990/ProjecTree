package com.ssafy.projectree.domain.tech.model.entity;

import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "workspace_tech_stack")
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceTechStack extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "workspace_id", nullable = false)
	private Workspace workspace;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "tech_vocab_id", nullable = false)
	private TechVocabulary techVocabulary;
}
