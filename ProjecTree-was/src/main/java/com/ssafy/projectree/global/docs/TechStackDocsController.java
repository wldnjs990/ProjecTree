package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.tech.api.dto.TechVocabularyDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Tag(name = "Tech Stack", description = "기술 스택 관련 API")
public interface TechStackDocsController {

    @Operation(
            summary = "기술 스택 자동완성",
            description = "입력된 키워드를 포함하는 기술 스택 목록을 조회합니다."
    )
    CommonResponse<List<TechVocabularyDto>> autocomplete(
            @Parameter(description = "검색 키워드", example = "Spring")
            @RequestParam String keyword
    );
}
