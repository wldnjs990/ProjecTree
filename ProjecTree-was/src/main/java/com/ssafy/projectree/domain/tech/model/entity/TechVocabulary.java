package com.ssafy.projectree.domain.tech.model.entity;

import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tech_vocabulary")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TechVocabulary extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(columnDefinition = "VARCHAR(100)", unique = true, nullable = false)
	private String name;
}
