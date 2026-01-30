package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.node.api.dto.CandidateCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeUpdateDto;
import com.ssafy.projectree.domain.node.api.dto.TechStackRecommendDto;
import com.ssafy.projectree.domain.node.api.dto.schema.NodeSchema;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.domain.workspace.api.dto.FunctionSpecificationDto;
import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;

import java.util.List;

public interface NodeService {
    NodeReadDto.Response getNodeDetails(Long nodeId);

    NodeTreeReadDto.Response getNodeTree(Long workspaceId);

    WorkspaceDto.ProgressInfo getStatistics(Long workspaceId);

    NodeCreateDto.Response createNode(Long candidateId, Long parentId, NodeCreateDto.Request request);

    ProjectNode createProjectNode(Workspace workspace);

    void createEpicNodes(Workspace workspace, Node projectNode, List<FunctionSpecificationDto.EpicInfo> epics);

    CandidateCreateDto.Response createCandidate(Long parentId);

    TechStackRecommendDto.Response recommendTechStack(Long nodeId);

    NodeSchema getNodeSchemaDetail(Long nodeId, Long parentId);

    void updateNodeDetail(Long nodeId, NodeUpdateDto.Request request);

    void selectNodeTech(Long nodeId, Long selectedTechId);

    void deleteNode(Long nodeId);

}
