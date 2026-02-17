package com.ssafy.projectree.domain.porfolio.usecase;

import com.ssafy.projectree.domain.ai.dto.AiPortfolioGenerateDto;
import com.ssafy.projectree.domain.ai.dto.schemas.TaskTechStackSchema;
import com.ssafy.projectree.domain.ai.dto.schemas.UserTaskSchema;
import com.ssafy.projectree.domain.ai.service.InferenceService;
import com.ssafy.projectree.domain.auth.utils.SecurityUtils;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.node.model.entity.AdvanceNode;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.TaskNode;
import com.ssafy.projectree.domain.node.model.repository.NodeRepository;
import com.ssafy.projectree.domain.porfolio.api.dto.PortfolioDto;
import com.ssafy.projectree.domain.porfolio.model.entity.Portfolio;
import com.ssafy.projectree.domain.porfolio.model.repositroy.PortfolioRepository;
import com.ssafy.projectree.domain.tech.model.entity.NodeTechStack;
import com.ssafy.projectree.domain.tech.model.entity.TechStackInfo;
import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import com.ssafy.projectree.domain.tech.model.repository.NodeTechStackRepository;
import com.ssafy.projectree.domain.tech.model.repository.WorkspaceTechStackRepository;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.TeamRepository;
import com.ssafy.projectree.domain.workspace.model.repository.WorkspaceRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class PortfolioService {
    private final WorkspaceRepository workspaceRepository;
    private final PortfolioRepository portfolioRepository;
    private final InferenceService inferenceService;
    private final NodeRepository nodeRepository;
    private final TeamRepository teamRepository;
    private final NodeTechStackRepository nodeTechStackRepository;
    private final WorkspaceTechStackRepository workspaceTechStackRepository;


    @Transactional(readOnly = true)
    public PortfolioDto.Response findPortfolio(Long workspaceId) {
        Member currentMember = SecurityUtils.getCurrentMember();
        Portfolio portfolio = portfolioRepository.findByWorkspaceIdAndMemberId(currentMember.getId(), workspaceId).orElseThrow(() -> new BusinessLogicException(ErrorCode.PORTFOLIO_NOT_FOUND,
                "아직 포트폴리오가 생성되지 않았습니다. 포트폴리오 생성을 먼저 진행해주세요."));
        return PortfolioDto.Response.builder().id(portfolio.getId()).content(portfolio.getContent()).build();
    }

    public PortfolioDto.Response modifyPortfolio(PortfolioDto.Request request) {
        Member currentMember = SecurityUtils.getCurrentMember();
        Portfolio portfolio = portfolioRepository.findById(request.getId()).orElseThrow(() -> new BusinessLogicException(ErrorCode.PORTFOLIO_NOT_FOUND));
        if (!portfolio.getMember().getId().equals(currentMember.getId())) {
            throw new BusinessLogicException(ErrorCode.PORTFOLIO_INVALID_ACCESS_ERROR, "본인만 포트폴리오를 조회 할 수 있습니다.");
        }
        portfolio.setContent(request.getContent());
        Portfolio save = portfolioRepository.save(portfolio);
        return PortfolioDto.Response.builder().id(save.getId()).content(save.getContent()).build();
    }

    public PortfolioDto.Response generatePortfolio(Long workspaceId) {
        Member currentMember = SecurityUtils.getCurrentMember();

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.WORKSPACE_NOT_FOUND));
        List<String> workspaceTechStacks = workspaceTechStackRepository.findTechNamesByWorkspace(workspace);
        int headCount = teamRepository.countByWorkspace(workspace);
        List<TaskNode> taskNodes = nodeRepository.findTaskNodesByWorkspaceAndMember(workspaceId, currentMember.getId());
        List<AdvanceNode> advanceNodes = nodeRepository.findAdvanceNodesByWorkspaceAndMember(workspaceId, currentMember.getId());

        List<UserTaskSchema> taskNodeSchemas = taskNodes.stream().map(this::mapNodeToSchema).toList();
        List<UserTaskSchema> advanceNodeSchemas = advanceNodes.stream().map(this::mapNodeToSchema).toList();

        List<UserTaskSchema> userTaskSchemas = Stream.concat(taskNodeSchemas.stream(), advanceNodeSchemas.stream())
                .collect(Collectors.toList());

        AiPortfolioGenerateDto.Request request = AiPortfolioGenerateDto.Request.builder()
                .projectTitle(workspace.getName())
                .projectStartDate(workspace.getStartDate())
                .projectEndDate(workspace.getEndDate())
                .projectTechStack(workspaceTechStacks)
                .projectDescription(workspace.getDescription())
                .projectHeadCount(headCount)
                .memberId(currentMember.getId())
                .workspaceId(workspace.getId())
                .userTaskSchemas(userTaskSchemas)
                .build();

        AiPortfolioGenerateDto.Response response = inferenceService.generatePortfolio(request);

        Portfolio portfolio = Portfolio.builder()
                .content(response.getContent())
                .member(currentMember)
                .workspace(workspace)
                .build();

        Portfolio savedPortfolio = portfolioRepository.save(portfolio);

        return PortfolioDto.Response.builder()
                .id(savedPortfolio.getId())
                .content(savedPortfolio.getContent())
                .build();
    }

    private UserTaskSchema mapNodeToSchema(Node node) {
        List<NodeTechStack> techStacks = nodeTechStackRepository.findAllByNode(node);
        NodeTechStack selectedTechStack = techStacks.stream()
                .filter(nts -> nts.getTechStackInfo() != null && nts.getTechStackInfo().isSelected())
                .findFirst()
                .orElse(techStacks.isEmpty() ? null : techStacks.get(0));

        TaskTechStackSchema techStackSchema = null;
        if (selectedTechStack != null && selectedTechStack.getTechStackInfo() != null && selectedTechStack.getTechVocabulary() != null) {
            TechStackInfo info = selectedTechStack.getTechStackInfo();
            TechVocabulary vocab = selectedTechStack.getTechVocabulary();
            techStackSchema = TaskTechStackSchema.builder()
                    .name(vocab.getName())
                    .advantage(info.getAdvantage())
                    .disadvantage(info.getDisadvantage())
                    .description(info.getDescription())
                    .build();
        }

        return UserTaskSchema.builder()
                .taskName(node.getName())
                .taskDescription(node.getDescription())
                .taskNote(node.getNote())
                .techStack(techStackSchema)
                .build();
    }
}
