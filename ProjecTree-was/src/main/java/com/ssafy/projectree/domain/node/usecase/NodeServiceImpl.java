package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.ai.dto.AiCandidateCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiNodeCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiTechRecommendDto;
import com.ssafy.projectree.domain.ai.service.InferenceService;
import com.ssafy.projectree.domain.member.api.dto.schemas.MemberSchema;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import com.ssafy.projectree.domain.node.api.dto.CandidateCreateDto;
import com.ssafy.projectree.domain.node.api.dto.CustomNodeDto;
import com.ssafy.projectree.domain.node.api.dto.CustomTechCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeUpdateDto;
import com.ssafy.projectree.domain.node.api.dto.TechStackRecommendDto;
import com.ssafy.projectree.domain.node.api.dto.schema.CandidateSchema;
import com.ssafy.projectree.domain.node.api.dto.schema.NodeSchema;
import com.ssafy.projectree.domain.node.api.dto.schema.NodeWithParentSchema;
import com.ssafy.projectree.domain.node.api.dto.schema.PositionSchema;
import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import com.ssafy.projectree.domain.node.model.entity.AdvanceNode;
import com.ssafy.projectree.domain.node.model.entity.Candidate;
import com.ssafy.projectree.domain.node.model.entity.EpicNode;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.domain.node.model.entity.StoryNode;
import com.ssafy.projectree.domain.node.model.entity.TaskNode;
import com.ssafy.projectree.domain.node.model.repository.CandidateRepository;
import com.ssafy.projectree.domain.node.model.repository.NodeRepository;
import com.ssafy.projectree.domain.node.model.repository.NodeTreeRepository;
import com.ssafy.projectree.domain.tech.api.dto.schemas.TechStackSchema;
import com.ssafy.projectree.domain.tech.model.entity.NodeTechStack;
import com.ssafy.projectree.domain.tech.model.entity.TechStackInfo;
import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import com.ssafy.projectree.domain.tech.model.repository.NodeTechStackRepository;
import com.ssafy.projectree.domain.tech.model.repository.TechStackInfoRepository;
import com.ssafy.projectree.domain.tech.model.repository.TechVocabularyRepository;
import com.ssafy.projectree.domain.workspace.api.dto.FunctionSpecificationDto;
import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.TeamRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.lang.Nullable;
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
    private final NodeTechStackRepository nodeTechStackRepository;
    private final TechStackInfoRepository techStackInfoRepository;
    private final TechVocabularyRepository techVocabularyRepository;
    private final TeamRepository teamRepository;

    private ProjectNode findRootNode(Long nodeId) {
        PageRequest limitOne = PageRequest.of(0, 1);

        return nodeTreeRepository.findRoot(nodeId, limitOne).stream()
                .findFirst().orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR, "프로젝트 노드를 찾을 수 없습니다."));
    }

    @Override
    public NodeReadDto.Response getNodeDetails(Long nodeId) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR, "노드를 찾을 수 없습니다."));
//        ProjectNode rootNode = findRootNode(node.getId());
//TODO: 시큐리티 Utils 추가되면 member 입력
//        teamRepository.isParticipant(rootNode.getWorkspace(), )

        List<Candidate> candidates = candidateRepository.findByParent(node);
        List<NodeTechStack> techStacks = nodeTechStackRepository.findAllByNode(node);

        String comparison = null;
        if (node instanceof TaskNode taskNode) {
            comparison = taskNode.getComparison();
        } else if (node instanceof AdvanceNode advanceNode) {
            comparison = advanceNode.getComparison();
        }

        return NodeReadDto.Response.builder()
                .id(node.getId())
                .assignee(node.getMember() != null ?
                        MemberSchema.builder()
                                .id(node.getMember().getId())
                                .nickname(node.getMember().getNickname())
                                .build() : null)
                .description(node.getDescription())
                .note(node.getNote())
                .candidates(candidates.stream()
                        .map(candidate -> CandidateSchema.builder()
                                .id(candidate.getId())
                                .name(candidate.getName())
                                .description(candidate.getDescription())
                                .summary(candidate.getSummary())
                                .isSelected(candidate.isSelected())
                                .derivationId(candidate.getDerivationNode() == null ? null : candidate.getDerivationNode().getId())//N+1 문제 발생
                                .build())
                        .toList())
                .techs(techStacks.stream()
                        .map(techStack -> TechStackSchema.builder()
                                .id(techStack.getId())
                                .name(techStack.getTechVocabulary().getName())
                                .advantage(techStack.getTechStackInfo().getAdvantage())
                                .disAdvantage(techStack.getTechStackInfo().getDisadvantage())
                                .description(techStack.getTechStackInfo().getDescription())
                                .ref(techStack.getTechStackInfo().getRef())
                                .recommendScore(techStack.getTechStackInfo().getRecommendation())
                                .isSelected(techStack.getTechStackInfo().isSelected())
                                .build())
                        .toList())
                .comparison(comparison)
                .build();
    }

    @Override
    public NodeTreeReadDto.Response getNodeTree(Long workspaceId) {
        List<NodeWithParentSchema> flatNodes = nodeRepository.findAllFlatNodesByWorkspace(workspaceId);
        return NodeTreeReadDto.Response
                .builder()
                .tree(flatNodes.stream().map(node -> {
                    log.info("node type : {} ", node.getNodeType());
                    log.info("task type : {}", node.getTaskType());
                    log.info("status type : {}", node.getStatus());
                    log.info("position info : {} {}", node.getxPos(), node.getyPos());

                    return NodeSchema.builder()
                            .id(node.getId())
                            .name(node.getName())
                            .parentId(node.getParentId())//todo
                            .nodeType(NodeType.fromClassName(node.getNodeType()))
                            .data(NodeSchema.Body.builder()
                                    .status(NodeStatus.valueOf(node.getStatus()))
                                    .identifier(node.getIdentifier())
                                    .difficult(node.getDifficult())//todo
                                    .taskType(node.getTaskType() != null ? TaskType.valueOf(node.getTaskType()) : null) //todo
                                    .priority(node.getPriority() != null ? Priority.valueOf(node.getPriority()) : null)
                                    .build())
                            .position(PositionSchema.builder()
                                    .xPos(node.getxPos())
                                    .yPos(node.getyPos())
                                    .build()).build();
                }).toList())
                .build();
    }

    public WorkspaceDto.ProgressInfo getStatistics(Long workspaceId) {

        List<NodeWithParentSchema> flatNodes = nodeRepository.findAllFlatNodesByWorkspace(workspaceId);

        // 통계 계산
        int totalCount = flatNodes.size();
        int p0Total = 0, p0Completed = 0;
        int p1Total = 0, p1Completed = 0;
        int p2Total = 0, p2Completed = 0;

        for (NodeWithParentSchema node : flatNodes) {
            Priority priority = node.getPriority() != null ? Priority.valueOf(node.getPriority()) : null;
            boolean isCompleted = "DONE".equals(node.getStatus());

            if (priority != null) {
                switch (priority) {
                    case P0:
                        p0Total++;
                        if (isCompleted) p0Completed++;
                        break;
                    case P1:
                        p1Total++;
                        if (isCompleted) p1Completed++;
                        break;
                    case P2:
                        p2Total++;
                        if (isCompleted) p2Completed++;
                        break;
                }
            }
        }

        WorkspaceDto.PriorityProgress p0 = WorkspaceDto.PriorityProgress
                .builder()
                .total(p0Total)
                .completed(p0Completed)
                .build();

        WorkspaceDto.PriorityProgress p1 = WorkspaceDto.PriorityProgress
                .builder()
                .total(p1Total)
                .completed(p1Completed)
                .build();

        WorkspaceDto.PriorityProgress p2 = WorkspaceDto.PriorityProgress
                .builder()
                .total(p2Total)
                .completed(p2Completed)
                .build();

        WorkspaceDto.ProgressInfo statistics = WorkspaceDto.ProgressInfo
                .builder()
                .p0(p0)
                .p1(p1)
                .p2(p2)
                .build();

        return statistics;
    }

    @Override
    public NodeCreateDto.Response generateNode(Long candidateId, Long parentId, NodeCreateDto.Request request) {

        ProjectNode projectNode = findRootNode(parentId);

        Long workspaceId = projectNode.getWorkspace().getId();

        AiNodeCreateDto.Response response = inferenceService.generateNode(AiNodeCreateDto.Request.builder()
                .candidateId(candidateId)
                .parentId(parentId)
                .xPos(request.getXPos())
                .yPos(request.getYPos())
                .workspaceId(workspaceId)
                .build()
        );

        NodeSchema nodeSchema = getNodeSchemaDetail(response.getNodeId(), response.getParentId());
        nodeSchema.setPreviewNodeId(request.getPreviewNodeId());
        nodeCrdtService.sendNodeCreationToCrdt(workspaceId, nodeSchema);

        return NodeCreateDto.Response.builder().nodeId(response.getNodeId()).build();
    }

    @Override
    public ProjectNode createProjectNode(Workspace workspace) {

        ProjectNode projectNode = new ProjectNode();

        projectNode.setWorkspace(workspace);
        projectNode.setName(workspace.getName());
        projectNode.setDescription(workspace.getDescription());
        projectNode.setStatus(NodeStatus.TODO);
        projectNode.setIdentifier(workspace.getIdentifierPrefix());

        projectNode.setXPos(0.0);
        projectNode.setYPos(0.0);

        nodeRepository.saveRoot(projectNode);

        return projectNode;
    }

    @Override
    public void createEpicNodes(Workspace workspace, Node projectNode, List<FunctionSpecificationDto.EpicInfo> epics) {

        // 에픽 정보가 없으면 아무 작업도 하지 않는다.
        if (epics == null || epics.isEmpty()) {
            return;
        }

        for (FunctionSpecificationDto.EpicInfo info : epics) {

            EpicNode epicNode = new EpicNode();

            epicNode.setName(info.getName());
            epicNode.setDescription(info.getDescription());
            epicNode.setIdentifier(workspace.getIdentifierPrefix());
            epicNode.setStatus(NodeStatus.TODO);
            epicNode.setXPos(0.0);
            epicNode.setYPos(0.0);

            nodeRepository.saveWithParent(projectNode.getId(), epicNode);

        }

    }

    @Override
    public CandidateCreateDto.Response generateCandidate(Long parentId) {
        ProjectNode projectNode = findRootNode(parentId);
        Node node = nodeRepository.findById(parentId).orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR));
        if (node.getCandidateLimit() <= candidateRepository.countCandidateByParent(node)) {
            throw new BusinessLogicException(ErrorCode.CANDIDATE_GENERATE_LIMIT, "후보 노드 생성 개수를 초과하였습니다.");
        }
        AiCandidateCreateDto.Response candidate = inferenceService.generateCandidate(AiCandidateCreateDto.Request.builder()
                .workspaceId(projectNode.getWorkspace().getId())
                .nodeId(parentId)
                .candidateCount(3)
                .build());

        nodeCrdtService.sendCandidatesCreationToCrdt(projectNode.getWorkspace().getId(), parentId, candidate);

        return CandidateCreateDto.Response.builder()
                .nodeId(parentId)
                .build();
    }

    @Override
    public CustomNodeDto.Response createCustom(CustomNodeDto.Request dto) {

        Node node = createByNodeType(dto.getNodeType(), dto.getTaskType());
        node.setName(dto.getName());
        node.setDescription(dto.getDescription());
        node.setXPos(dto.getXPos());
        node.setYPos(dto.getYPos());
        node.setStatus(NodeStatus.TODO);
        nodeRepository.saveWithParent(dto.getParentNodeId(), node);

        NodeSchema nodeSchema = NodeSchema.convertToSchema(node, dto.getParentNodeId());
        nodeCrdtService.sendNodeCreationToCrdt(dto.getWorkspaceId(), nodeSchema);

        return CustomNodeDto.Response.builder()
                .name(node.getName())
                .description(node.getDescription())
                .nodeType(node.getNodeType())
                .parentNodeId(dto.getParentNodeId())
                .xPos(node.getXPos())
                .yPos(node.getYPos())
                .build();
    }

    private Node createByNodeType(NodeType nodeType, @Nullable TaskType taskType) {
        if (nodeType.equals(NodeType.EPIC)) return new EpicNode();
        else if (nodeType.equals(NodeType.STORY)) return new StoryNode();
        else if (nodeType.equals(NodeType.TASK)) return TaskNode.builder().type(taskType).build();
        else if (nodeType.equals(NodeType.ADVANCE)) return new AdvanceNode();
        else {
            throw new BusinessLogicException(ErrorCode.NODE_TYPE_NOT_SUPPORT_ERROR, "유효하지 않는 노드 타입입니다.");
        }
    }

    @Override
    public TechStackRecommendDto.Response recommendTechStack(Long nodeId) {
        ProjectNode projectNode = findRootNode(nodeId);
        Class<? extends Node> nodeClass = nodeRepository.findNodeTypeById(nodeId).orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR, "노드를 찾을 수 없습니다"));

        if (!(nodeClass.equals(TaskNode.class) || nodeClass.equals(AdvanceNode.class))) {
            throw new BusinessLogicException(ErrorCode.NODE_TYPE_NOT_SUPPORT_ERROR, "해당 작업은 Task와 Advance 노드에서만 수행할 수 있습니다.");
        }

        Long workspaceId = projectNode.getWorkspace().getId();

        AiTechRecommendDto.Response response = inferenceService.recommendTechStack(AiTechRecommendDto.Request.builder()
                .nodeId(nodeId)
                .workspaceId(workspaceId)
                .build());

        nodeCrdtService.sendTechCreationToCrdt(workspaceId,
                nodeId, response);

        return TechStackRecommendDto.Response.builder()
                .nodeId(nodeId)
                .build();
    }

    @Override
    @Transactional
    public void updateNodeDetail(Long nodeId, NodeUpdateDto.Request request) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR));

        if (request.getDescription() != null) node.setDescription(request.getDescription());

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

    @Transactional
    @Override
    public void selectNodeTech(Long nodeId, Long selectedTechId) {
        nodeTechStackRepository.unselectAllByNodeId(nodeId);

        TechStackInfo techStackInfo = techStackInfoRepository.findById(selectedTechId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.TECHSTACK_NOT_FOUND, "존재하지 않는 기술입니다."));

        techStackInfo.setSelected(true);

        techStackInfoRepository.save(techStackInfo);
    }

    @Override
    public NodeSchema getNodeSchemaDetail(Long nodeId, Long parentId) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR));

        return NodeSchema.convertToSchema(node, parentId);
    }

    @Override
    public void deleteNode(Long nodeId) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR));

        if (node.isDeleted()) {
            return;
        }

        nodeRepository.deleteNodeAndDescendants(nodeId);
        candidateRepository.deleteByParentId(nodeId);
        candidateRepository.disConnectDerivation(nodeId);
    }

    @Override
    public void deleteCandidate(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.CANDIDATE_NOT_FOUND_ERROR));

        candidateRepository.delete(candidate);
    }

    @Transactional
    @Override
    public void createCustomTechStack(Long nodeId, Long workspaceId, Long techVocaId) {

        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR));

        TechVocabulary techVocabulary = techVocabularyRepository.findById(techVocaId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.TECHSTACK_NOT_FOUND));

        TechStackInfo techStackInfo = new TechStackInfo();
        techStackInfo.setDescription(null);
        techStackInfo.setAdvantage(null);
        techStackInfo.setDisadvantage(null);
        techStackInfo.setRef(null);
        techStackInfo.setRecommendation(0);
        techStackInfo.setSelected(false);

        techStackInfoRepository.save(techStackInfo);

        NodeTechStack nodeTechStack = new NodeTechStack();
        nodeTechStack.setNode(node);
        nodeTechStack.setTechVocabulary(techVocabulary);
        nodeTechStack.setTechStackInfo(techStackInfo);
        nodeTechStack.setRecommended(false);

        nodeTechStackRepository.save(nodeTechStack);

        nodeCrdtService.sendCustomTechCreationToCrdt(workspaceId, nodeId, CustomTechCreateDto.Response.builder()
                .id(nodeTechStack.getId())
                .name(techVocabulary.getName())
                .build());
    }

}
