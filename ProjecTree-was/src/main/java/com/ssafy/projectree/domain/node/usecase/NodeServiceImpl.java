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
    private final MemberRepository memberRepository;
    private final NodeRepository nodeRepository;
    private final CandidateRepository candidateRepository;
    private final NodeTreeRepository nodeTreeRepository;


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
        //ToDo: candidate id에 대한 락 구현 - Redis 캐시 연동 이후
        AiNodeCreateDto.Response response = inferenceService.createNode(AiNodeCreateDto.Request.builder()
                .candidateId(candidateId)
                .parentId(parentId)
                .xPos(request.getXPos())
                .yPos(request.getYPos())
                .workspaceId(projectNode.getWorkspace().getId())
                .build()
        );

        // TODO: 해당 위치에 y-websocket 서버에 데이터 전송 로직 필요
        // 별개의 서비스에서 구현

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

    @Transactional
    @Override
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
}
