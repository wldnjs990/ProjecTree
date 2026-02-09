package com.ssafy.projectree.domain.ai.service;

import com.ssafy.projectree.domain.ai.dto.AiCandidateCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiNodeCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiPortfolioGenerateDto;
import com.ssafy.projectree.domain.ai.dto.AiTechRecommendDto;

public interface InferenceService {

    AiCandidateCreateDto.Response generateCandidate(AiCandidateCreateDto.Request request);
    AiNodeCreateDto.Response generateNode(AiNodeCreateDto.Request request);
    AiTechRecommendDto.Response recommendTechStack(AiTechRecommendDto.Request request);
    AiPortfolioGenerateDto.Response generatePortfolio(AiPortfolioGenerateDto.Request request);
}
