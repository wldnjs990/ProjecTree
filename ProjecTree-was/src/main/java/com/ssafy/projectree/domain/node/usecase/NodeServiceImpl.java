package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.ai.dto.AiCandidateCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiNodeCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiTechRecommendDto;
import com.ssafy.projectree.domain.ai.service.InferenceService;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import com.ssafy.projectree.domain.node.api.dto.CandidateCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeUpdateDto;
import com.ssafy.projectree.domain.node.api.dto.TechStackRecommendDto;
import com.ssafy.projectree.domain.node.api.dto.schema.NodeSchema;
import com.ssafy.projectree.domain.node.api.dto.schema.NodeWithParentSchema;
import com.ssafy.projectree.domain.node.api.dto.schema.PositionSchema;
import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NodeServiceImpl implements NodeService {
    private final InferenceService inferenceService;
    private final NodeRepository nodeRepository;
    private final MemberRepository memberRepository;
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
        List<NodeWithParentSchema> flatNodes = nodeRepository.findAllFlatNodesByWorkspace(workspaceId);
        return NodeTreeReadDto.Response
                .builder()
                .tree(flatNodes.stream().map(node-> {
                    log.info("node type : {} ",node.getNodeType());
                    log.info("task type : {}", node.getTaskType());
                    log.info("status type : {}", node.getStatus());

                    return NodeSchema.builder()
                            .id(node.getId())
                            .name(node.getName())
                            .parentId(node.getParentId())//todo
                            .nodeType(NodeType.fromClassName(node.getNodeType()))
                            .data(NodeSchema.Body.builder()
                                    .status(NodeStatus.valueOf(node.getStatus()))
                                    .identifier(node.getIdentifier())
                                    .difficult(node.getDifficult())//todo
                                    .taskType(node.getTaskType() != null ? TaskType.valueOf(node.getTaskType()): null) //todo
                                    .priority(node.getPriority() != null ? Priority.valueOf(node.getPriority()): null)
                                    .build())
                            .position(PositionSchema.builder()
                                    .xPos(node.getXPos())
                                    .yPos(node.getYPos())
                                    .build()).build();
                }).toList())
                .build();
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
    @Transactional
    public void updateNodeDetail(Long nodeId, NodeUpdateDto.Request request) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR));

        if (request.getDifficult() != null) {
            if (node instanceof TaskNode taskNode) {
                taskNode.setDifficult(request.getDifficult());
            } else if (node instanceof AdvanceNode advanceNode) {
                advanceNode.setDifficult(request.getDifficult());
            }
        }

        if (request.getStatus() != null) node.setStatus(request.getStatus());
        if (request.getPriority() != null) node.setPriority(request.getPriority());
        if (request.getNote() != null) node.setNote(request.getNote());

        if (request.getAssignee() != null) {
            Member assignee = memberRepository.findById(request.getAssignee())
                    .orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR));
            node.setMember(assignee);
        }
    }

    @Override
    public NodeSchema getNodeSchemaDetail(Long nodeId, Long parentId) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR));

        return NodeSchema.convertToSchema(node, parentId);
    }

}
