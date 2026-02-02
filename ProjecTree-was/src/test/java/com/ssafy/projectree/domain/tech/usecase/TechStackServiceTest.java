package com.ssafy.projectree.domain.tech.usecase;

import com.ssafy.projectree.domain.tech.api.dto.TechVocabularyDto;
import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import com.ssafy.projectree.domain.tech.model.repository.TechVocabularyRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class TechStackServiceTest {

    @Mock
    private TechVocabularyRepository techVocabularyRepository;

    @InjectMocks
    private TechStackService techStackService;

    @Test
    @DisplayName("기술 스택 자동완성 검색 성공")
    void searchTechVocabulary_success() {
        // given
        String keyword = "Java";
        TechVocabulary tech1 = new TechVocabulary(1L, "Java");
        TechVocabulary tech2 = new TechVocabulary(2L, "JavaScript");
        List<TechVocabulary> techList = List.of(tech1, tech2);

        given(techVocabularyRepository.findTop10ByNameStartingWithIgnoreCaseOrderByNameAsc(keyword)).willReturn(techList);

        // when
        List<TechVocabularyDto> result = techStackService.searchTechVocabulary(keyword);

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Java");
        assertThat(result.get(1).getName()).isEqualTo("JavaScript");
        verify(techVocabularyRepository).findTop10ByNameStartingWithIgnoreCaseOrderByNameAsc(keyword);
    }
}
