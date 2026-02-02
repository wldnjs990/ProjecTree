package com.ssafy.projectree.domain.tech.model.repository;

import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TechVocabularyRepository extends JpaRepository<TechVocabulary, Long> {

	boolean existsByName(String name);


	List<TechVocabulary> findTop10ByNameStartingWithIgnoreCaseOrderByNameAsc(String name);
}
