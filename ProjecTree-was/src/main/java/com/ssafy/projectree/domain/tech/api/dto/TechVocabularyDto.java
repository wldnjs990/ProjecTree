package com.ssafy.projectree.domain.tech.api.dto;

import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechVocabularyDto {
    private Long id;
    private String name;

    public static TechVocabularyDto from(TechVocabulary entity) {
        return TechVocabularyDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }
}
