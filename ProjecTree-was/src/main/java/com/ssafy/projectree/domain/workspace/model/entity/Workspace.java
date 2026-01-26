package com.ssafy.projectree.domain.workspace.model.entity;

import com.ssafy.projectree.domain.workspace.enums.ServiceType;
import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@SuperBuilder
@Table(name = "workspace")
public class Workspace extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(length = 20, nullable = false)
	private String name;

	//추가할까 말까
	@Enumerated(value = EnumType.STRING)
	private ServiceType serviceType;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(length = 20)
	private String domain;

	@Column(name = "start_date")
	private LocalDate startDate;

	@Column(name = "end_date")
	private LocalDate endDate;

	@Column(columnDefinition = "VARCHAR(20)")
	private String purpose;

	@Column(name = "identifier_prefix", length = 20)
	private String identifierPrefix;
}

