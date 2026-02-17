package com.ssafy.projectree.domain.tech.model.entity;

import com.ssafy.projectree.domain.node.model.entity.Node;
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
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "node_tech_stack")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE node_tech_stack SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class NodeTechStack extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "node_id")
	private Node node;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tech_vocab_id")
	private TechVocabulary techVocabulary;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tech_stack_info_id")
	private TechStackInfo techStackInfo;


	private boolean isRecommended;
}
