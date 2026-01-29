package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.ai.dto.AiCandidateCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiNodeCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiTechRecommendDto;
import com.ssafy.projectree.domain.ai.service.InferenceService;
import com.ssafy.projectree.domain.node.api.dto.CandidateCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
import com.ssafy.projectree.domain.node.api.dto.TechStackRecommendDto;
import com.ssafy.projectree.domain.node.api.dto.schema.NodeSchema;
import com.ssafy.projectree.domain.node.api.dto.schema.PositionSchema;
import com.ssafy.projectree.domain.node.model.entity.AdvanceNode;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.domain.node.model.entity.TaskNode;
import com.ssafy.projectree.domain.node.model.repository.CandidateRepository;
import com.ssafy.projectree.domain.node.model.repository.NodeRepository;
import com.ssafy.projectree.domain.node.model.repository.NodeTreeRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class NodeServiceImpl implements NodeService {
    private final InferenceService inferenceService;
    private final NodeRepository nodeRepository;
    private final CandidateRepository candidateRepository;
    private final NodeTreeRepository nodeTreeRepository;
    private final NodeCrdtService nodeCrdtService;

    private ProjectNode findRootNode(Long nodeId) {
        PageRequest limitOne = PageRequest.of(0, 1);

        return nodeTreeRepository.findRoot(nodeId, limitOne).stream()
                .findFirst().orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR, "프로젝트 노드를 찾을 수 없습니다."));
    }

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

        ProjectNode projectNode = findRootNode(parentId);

        Long workspaceId = projectNode.getWorkspace().getId();

        //ToDo: candidate id에 대한 락 구현 - Redis 캐시 연동 이후
        AiNodeCreateDto.Response response = inferenceService.createNode(AiNodeCreateDto.Request.builder()
                .candidateId(candidateId)
                .parentId(parentId)
                .xPos(request.getXPos())
                .yPos(request.getYPos())
                .workspaceId(workspaceId)
                .build()
        );

        nodeCrdtService.sendNodeCreationToCrdt(workspaceId, getNodeSchemaDetail(response.getNodeId(), response.getParentId()));

        return NodeCreateDto.Response.builder().nodeId(response.getNodeId()).build();
    }

    @Override
    public CandidateCreateDto.Response createCandidate(Long parentId) {
        ProjectNode projectNode = findRootNode(parentId);
        //ToDo: parent id에 대한 락 구현 - Redis 캐시 연동 이후
        AiCandidateCreateDto.Response candidate = inferenceService.createCandidate(AiCandidateCreateDto.Request.builder()
                .workspaceId(projectNode.getWorkspace().getId())
                .nodeId(parentId)
                .candidateCount(3)
                .build());
        return CandidateCreateDto.Response.builder()
                .candidates(candidate.getCandidates())
                .build();
    }

    @Override
    public TechStackRecommendDto.Response recommendTechStack(Long nodeId) {
        ProjectNode projectNode = findRootNode(nodeId);
        Class<? extends Node> nodeClass = nodeRepository.findNodeTypeById(nodeId).orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR, "노드를 찾을 수 없습니다"));
        if (!(nodeClass.equals(TaskNode.class) || nodeClass.equals(AdvanceNode.class))) {
            throw new BusinessLogicException(ErrorCode.NODE_TYPE_NOT_SUPPORT_ERROR, "해당 작업은 Task와 Advance 노드에서만 수행할 수 있습니다.");
        }
        AiTechRecommendDto.Response response = inferenceService.recommendTechStack(AiTechRecommendDto.Request.builder()
                .nodeId(nodeId)
                .workspaceId(projectNode.getWorkspace().getId())
                .build());
        return TechStackRecommendDto.Response.builder()
                .techs(response.getTechs())
                .comparison(response.getComparison())
                .build();
    }

    @Override
    public NodeSchema getNodeSchemaDetail(Long nodeId, Long parentId) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR));

        return convertToSchema(node, parentId);
    }

    private NodeSchema convertToSchema(Node entity, Long parentId) {
        // 공통 데이터 매핑
        NodeSchema.Body body = NodeSchema.Body.builder()
                .priority(entity.getPriority())
                .identifier(entity.getIdentifier())
                .status(entity.getStatus())
                .build();

        // 자식 타입에 따른 특화 데이터 매핑 (instanceof 활용)
        if (entity instanceof TaskNode task) {
            body.setTaskType(task.getType());
            body.setDifficult(task.getDifficult());
        } else if (entity instanceof AdvanceNode advance) {
            body.setDifficult(advance.getDifficult());
        }

        return NodeSchema.builder()
                .id(entity.getId())
                .name(entity.getName())
                .nodeType(entity.getNodeType())
                .parentId(parentId)
                .position(new PositionSchema(entity.getXPos(), entity.getYPos()))
                .data(body)
                .build();
    }
}
