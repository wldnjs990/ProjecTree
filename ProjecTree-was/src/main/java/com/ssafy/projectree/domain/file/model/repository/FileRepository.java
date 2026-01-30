package com.ssafy.projectree.domain.file.model.repository;

import com.ssafy.projectree.domain.file.model.entity.FileProperty;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<FileProperty, Long> {
    List<FileProperty> getFilesByWorkspace(Workspace workspace);
}
