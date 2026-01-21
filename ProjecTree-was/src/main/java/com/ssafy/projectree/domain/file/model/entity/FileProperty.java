package com.ssafy.projectree.domain.file.model.entity;

import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class FileProperty extends BaseEntity {

	@Id
	@GeneratedValue
	private Long id;
	private String originFileName;
	private String path;
	private String contentType;
	private String savedFileName;
	private Long uploaderId;
	private long size;

	public abstract void clear();
}
