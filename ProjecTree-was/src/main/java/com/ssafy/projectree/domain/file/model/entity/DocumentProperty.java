package com.ssafy.projectree.domain.file.model.entity;

import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@SuperBuilder
public class DocumentProperty extends FileProperty{


	@ManyToOne
	@JoinColumn(name = "workspace_id", nullable = false)
	private Workspace workspace;

	@Override
	public void clear() {
		this.workspace = null;
	}
}
