package com.ssafy.projectree.domain.file.model.repository;

import com.ssafy.projectree.domain.file.model.entity.FileProperty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.io.File;
import java.util.List;

public interface FileRepository extends JpaRepository<FileProperty, Long> {
    List<FileProperty> getFilesByWorkspaceId(Long id);
}
