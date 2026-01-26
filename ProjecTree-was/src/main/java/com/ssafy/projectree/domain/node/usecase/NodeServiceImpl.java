package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.node.api.dto.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class NodeServiceImpl implements NodeService {
    @Override
    public NodeReadDto.Response getNodeDetails(Long nodeId) {
        return null;
    }

    @Override
    public NodeTreeReadDto.Response getNodeTree(Long workspaceId) {
        return null;
    }

    @Override
    public NodeCreateDto.Response createNode(Long candidateId, Long parentId, NodeCreateDto.Request request) {
        return null;
    }

    @Override
    public CandidateCreateDto.Response createCandidate(Long parentId) {
        return null;
    }

    @Override
    public TechStackRecommendDto.Response recommendTechStack(Long nodeId) {
        return null;
    }
}
