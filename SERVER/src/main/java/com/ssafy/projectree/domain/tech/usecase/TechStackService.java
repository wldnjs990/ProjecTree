package com.ssafy.projectree.domain.tech.usecase;

import com.ssafy.projectree.domain.tech.api.dto.TechVocabularyDto;
import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import com.ssafy.projectree.domain.tech.model.repository.TechVocabularyRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TechStackService {

    private final TechVocabularyRepository techVocabularyRepository;

    public TechVocabulary findById(Long id) {
        return techVocabularyRepository.findById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.TECHSTACK_NOT_FOUND, "존재하지 않는 기술스택입니다."));
    }

    public List<TechVocabularyDto> searchTechVocabulary(String keyword) {
        return techVocabularyRepository.findTop10ByNameStartingWithIgnoreCaseOrderByIdAsc(keyword).stream()
                .map(TechVocabularyDto::from)
                .collect(Collectors.toList());
    }

}
