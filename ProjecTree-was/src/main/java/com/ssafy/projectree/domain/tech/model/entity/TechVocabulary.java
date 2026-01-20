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
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vocab_seq_gen")
	@SequenceGenerator(
			name = "vocab_seq_gen",
			sequenceName = "tech_vocab_seq",
			initialValue = 1,
			allocationSize = 50  // 중요: batch_size와 맞춰주면 성능이 극대화됩니다.
	)
	private Long id;
	@Column(columnDefinition = "VARCHAR(100)", unique = true, nullable = false)
	private String name;
}
