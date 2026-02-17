package com.ssafy.projectree.domain.tech.api.controller;

import com.ssafy.projectree.domain.tech.api.dto.TechVocabularyDto;
import com.ssafy.projectree.domain.tech.usecase.TechStackService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.TechStackDocsController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TechStackController implements TechStackDocsController {

    private final TechStackService techStackService;

    @Override
    @GetMapping("/tech-stacks/autocomplete")
    public CommonResponse<List<TechVocabularyDto>> autocomplete(@RequestParam String keyword) {
        return CommonResponse.success(SuccessCode.SUCCESS, techStackService.searchTechVocabulary(keyword));
    }
}