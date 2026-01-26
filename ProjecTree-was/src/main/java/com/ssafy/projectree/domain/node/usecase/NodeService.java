package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.node.api.dto.*;

public interface NodeService {
    NodeReadDto.Response getNodeDetails(Long nodeId);

    NodeTreeReadDto.Response getNodeTree(Long workspaceId);

    NodeCreateDto.Response createNode(Long candidateId, Long parentId, NodeCreateDto.Request request);

    CandidateCreateDto.Response createCandidate(Long parentId);

    TechStackRecommendDto.Response recommendTechStack(Long nodeId);
}
