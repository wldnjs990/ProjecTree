package com.ssafy.projectree.domain.tech.usecase;

import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import com.ssafy.projectree.domain.tech.model.repository.TechVocabularyRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TechVocabularyService {

    private final TechVocabularyRepository techVocabularyRepository;

    public TechVocabulary findById(Long id) {
        return techVocabularyRepository.findById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.TECHSTACK_NOT_FOUND, "존재하지 않는 기술스택입니다."));
    }

}
