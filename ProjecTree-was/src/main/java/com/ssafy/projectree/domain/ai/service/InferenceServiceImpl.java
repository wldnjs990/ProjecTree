package com.ssafy.projectree.domain.ai.service;

import com.ssafy.projectree.domain.ai.dto.AiCandidateCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiNodeCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiPortfolioGenerateDto;
import com.ssafy.projectree.domain.ai.dto.AiTechRecommendDto;
import com.ssafy.projectree.domain.ai.lock.LockType;
import com.ssafy.projectree.domain.ai.lock.utils.LockService;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.AIServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
@Log4j2
public class InferenceServiceImpl implements InferenceService {

    private final RestClient restClient;
    private final LockService lockService;
    @Value("${inference-server.url}")
    private String serverUrl;
    @Value("${inference-server.path-prefix}")
    private String pathPrefix;
    @Value("${inference-server.generate-candidate-path}")
    private String candidatePath;
    @Value("${inference-server.generate-node-path}")
    private String nodePath;
    @Value("${inference-server.recommend-tech-path}")
    private String recommendPath;
    @Value("${inference-server.generate-portfolio-path}")
    private String portfolioPath;

    @Override
    @Retryable(
            retryFor = {HttpServerErrorException.class, ResourceAccessException.class}, // 이 예외들에 대해서만 재시도
            maxAttempts = 3,  // 최대 3회 시도
            backoff = @Backoff(delay = 1000), // 재시도 간격 1초
            listeners = "retryLoggingListener" // << 여기에 추가
    )
    public AiCandidateCreateDto.Response createCandidate(AiCandidateCreateDto.Request request) {
        log.info("Candidate create start {}", request);
        String uriString = UriComponentsBuilder.fromUriString(serverUrl)
                .path(pathPrefix)
                .path(candidatePath)
                .build()
                .toUriString();

        return restClient.post().uri(uriString)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(AiCandidateCreateDto.Response.class)
                .getBody();
    }

    @Recover
    public AiCandidateCreateDto.Response recoverCandidate(RuntimeException e, AiCandidateCreateDto.Request request) {
        log.error("Candidate 생성 3회 재시도 실패: node_id={}", request.getNodeId(), e);
        // 여기서 최종적으로 커스텀 예외를 던집니다.
        throw new AIServiceException(ErrorCode.CANDIDATE_GENERATE_ERROR, request.getNodeId(), LockType.CANDIDATE, e.toString());
    }

    @Override
    @Retryable(
            retryFor = {HttpServerErrorException.class, ResourceAccessException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000),
            listeners = "retryLoggingListener" // << 여기에 추가

    )
    public AiNodeCreateDto.Response createNode(AiNodeCreateDto.Request request) {
        return restClient.post().uri(UriComponentsBuilder.fromUriString(serverUrl)
                        .path(pathPrefix)
                        .path(nodePath)
                        .build()
                        .toUriString())
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(AiNodeCreateDto.Response.class)
                .getBody();
    }

    @Recover
    public AiNodeCreateDto.Response recoverNode(RuntimeException e, AiNodeCreateDto.Request request) {
        log.error("Node 생성 3회 재시도 실패: candidate_id={}", request.getCandidateId(), e);
        throw new AIServiceException(ErrorCode.NODE_GENERATE_ERROR, request.getCandidateId(), LockType.NODE, e.toString());
    }


    @Override
    @Retryable(
            retryFor = {HttpServerErrorException.class, ResourceAccessException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000),
            listeners = "retryLoggingListener" // << 여기에 추가

    )
    public AiTechRecommendDto.Response recommendTechStack(AiTechRecommendDto.Request request) {
        return restClient.post().uri(UriComponentsBuilder.fromUriString(serverUrl)
                        .path(pathPrefix)
                        .path(recommendPath)
                        .build()
                        .toUriString())
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(AiTechRecommendDto.Response.class)
                .getBody();
    }

    @Recover
    public AiTechRecommendDto.Response recoverTech(RuntimeException e, AiTechRecommendDto.Request request) {
        log.error("Tech 추천 3회 재시도 실패: node_id={}", request.getNodeId(), e);
        throw new AIServiceException(ErrorCode.TECH_RECOMMEND_ERROR, request.getNodeId(), LockType.TECH, e.toString());
    }

    @Override
    @Retryable(
            retryFor = {HttpServerErrorException.class, ResourceAccessException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000),
            listeners = "retryLoggingListener"
    )
    public AiPortfolioGenerateDto.Response generatePortfolio(AiPortfolioGenerateDto.Request request) {
        return restClient.post().uri(UriComponentsBuilder.fromUriString(serverUrl)
                        .path(pathPrefix)
                        .path(portfolioPath)
                        .build()
                        .toUriString())
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(AiPortfolioGenerateDto.Response.class)
                .getBody();
    }

    @Recover
    public AiPortfolioGenerateDto.Response recoverPortfolio(RuntimeException e, AiPortfolioGenerateDto.Request request) {
        log.error("Portfolio 생성 3회 재시도 실패: projectTitle={}", request.getProjectTitle(), e);
        throw new AIServiceException(ErrorCode.PORTFOLIO_GENERATE_ERROR, 0L, LockType.PORTFOLIO, e.toString());
    }

}
