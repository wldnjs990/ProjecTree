package com.ssafy.projectree.domain.ai.service;

import com.ssafy.projectree.domain.ai.dto.AiCandidateCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiNodeCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiTechRecommendDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class InferenceServiceImpl implements InferenceService{

    private final RestClient restClient;
    @Value("${ai-server.url}")
    private String serverUrl;
    @Value("${ai-server.port}")
    private String serverPort;

    @Override
    public AiCandidateCreateDto.Response createCandidate(AiCandidateCreateDto.Request request) {
        return null;
    }

    @Override
    public AiNodeCreateDto.Response createNode(AiNodeCreateDto.Request request) {
        return null;
    }

    @Override
    public AiTechRecommendDto.Response recommendTechStack(AiTechRecommendDto.Request request) {
        return null;
    }
}
