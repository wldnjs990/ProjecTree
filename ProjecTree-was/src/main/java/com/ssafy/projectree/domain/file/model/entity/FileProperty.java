package com.ssafy.projectree.domain.file.model.entity;

import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.*;
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
public class FileProperty extends BaseEntity {

	@Id
	@GeneratedValue
	private Long id;
	private String originFileName;
	private String path;
	private String contentType;
	private String savedFileName;
	private Long uploaderId;
	private long size;

	@ManyToOne
	@JoinColumn(name = "workspace_id", nullable = false)
	private Workspace workspace;

	public void clear() {};
}
