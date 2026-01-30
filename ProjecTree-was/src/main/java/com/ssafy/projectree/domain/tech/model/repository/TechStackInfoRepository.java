package com.ssafy.projectree.domain.tech.model.repository;

import com.ssafy.projectree.domain.tech.model.entity.TechStackInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechStackInfoRepository extends JpaRepository<TechStackInfo, Long> {
}
