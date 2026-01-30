package com.ssafy.projectree.domain.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.projectree.domain.ai.dto.AiCandidateCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiNodeCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiTechRecommendDto;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.cache.CacheType;
import com.ssafy.projectree.global.exception.AIServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @Override
    public AiCandidateCreateDto.Response createCandidate(AiCandidateCreateDto.Request request) {

        ResponseEntity<AiCandidateCreateDto.Response> response = null;
        try {
            String uriString = UriComponentsBuilder.fromUriString(serverUrl)
                    .path(pathPrefix)
                    .path(candidatePath)
                    .build()
                    .toUriString();
            response = restClient.post().uri(uriString)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toEntity(AiCandidateCreateDto.Response.class);
        } catch (HttpServerErrorException | ResourceAccessException e) {
            throw new AIServiceException(ErrorCode.CANDIDATE_GENERATE_ERROR, request.getNodeId(), CacheType.CANDIDATE, e.getMessage());
        }
	    return response.getBody();
    }

    @Override
    public AiNodeCreateDto.Response createNode(AiNodeCreateDto.Request request) {
        ResponseEntity<AiNodeCreateDto.Response> response = null;
        try {
            response = restClient.post().uri(UriComponentsBuilder.fromUriString(serverUrl)
                            .path(pathPrefix)
                            .path(nodePath)
                            .build()
                            .toUriString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toEntity(AiNodeCreateDto.Response.class);
        }catch (HttpServerErrorException | ResourceAccessException e){
            throw new AIServiceException(ErrorCode.NODE_GENERATE_ERROR, request.getCandidateId(), CacheType.NODE, e.getMessage());
        }
        return response.getBody();
    }


    @Override
    public AiTechRecommendDto.Response recommendTechStack(AiTechRecommendDto.Request request) {
        ResponseEntity<AiTechRecommendDto.Response> response = null;
        try {
            response = restClient.post().uri(UriComponentsBuilder.fromUriString(serverUrl)
                            .path(pathPrefix)
                            .path(recommendPath)
                            .build()
                            .toUriString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toEntity(AiTechRecommendDto.Response.class);
        }catch (HttpServerErrorException | ResourceAccessException e){
            throw new AIServiceException(ErrorCode.NODE_GENERATE_ERROR, request.getNodeId(),CacheType.TECH, e.getMessage());
        }
        return response.getBody();
    }
}
