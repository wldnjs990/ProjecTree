package com.ssafy.projectree.domain.tech.model.entity;

import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TechStackInfo extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;


	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(columnDefinition = "TEXT")
	private String advantage;

	@Column(columnDefinition = "TEXT")
	private String disadvantage;

	@Column(columnDefinition = "TEXT")
	private String ref;

	private int recommendation;

	private boolean isSelected;

}
