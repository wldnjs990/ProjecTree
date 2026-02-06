package com.ssafy.projectree.domain.node.api.controller;

import com.ssafy.projectree.domain.ai.lock.LockType;
import com.ssafy.projectree.domain.ai.lock.utils.LockService;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.node.api.dto.CandidateCreateDto;
import com.ssafy.projectree.domain.node.api.dto.CustomNodeDto;
import com.ssafy.projectree.domain.node.api.dto.CustomTechCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
import com.ssafy.projectree.domain.node.api.dto.TechStackRecommendDto;
import com.ssafy.projectree.domain.node.usecase.NodeService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.NodeDocsController;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class NodeController implements NodeDocsController {
    private final NodeService nodeService;
    private final LockService lockService;

    @GetMapping("/nodes/{node-id}")
    public CommonResponse<NodeReadDto.Response> getNodeDetails(
            @PathVariable(value = "node-id") Long nodeId
    ) {
        return CommonResponse.success(SuccessCode.SUCCESS, nodeService.getNodeDetails(nodeId));
    }

    @GetMapping("/workspaces/{workspace-id}")
    public CommonResponse<NodeTreeReadDto.Response> getNodeTree(@PathVariable(value = "workspace-id") Long workspaceId) {
        return CommonResponse.success(SuccessCode.SUCCESS, nodeService.getNodeTree(workspaceId));
    }

    @PostMapping("/nodes/{node-id}/candidates/{candidate-id}")
    public CommonResponse<NodeCreateDto.Response> createNode(@PathVariable(name = "candidate-id") Long candidateId,
                                                             @PathVariable(name = "node-id") Long parentId,
                                                             @RequestBody NodeCreateDto.Request request) {
        return CommonResponse.success(SuccessCode.SUCCESS, lockService.execute(LockType.NODE, String.valueOf(candidateId), () -> nodeService.createNode(candidateId, parentId, request)));
    }

    @PostMapping("/nodes/{node-id}/candidates")
    public CommonResponse<CandidateCreateDto.Response> createCandidates(@PathVariable(name = "node-id") Long parentId,
                                                                        @RequestBody CandidateCreateDto.Request request) {
        return CommonResponse.success(SuccessCode.SUCCESS, lockService.execute(LockType.CANDIDATE, String.valueOf(parentId), () -> nodeService.createCandidate(parentId, request.getWorkspaceId())));
    }

    @PostMapping("/nodes/{node-id}/tech-stack/recommendation")
    public CommonResponse<TechStackRecommendDto.Response> recommendTechStack(@PathVariable(name = "node-id") Long nodeId) {
        return CommonResponse.success(SuccessCode.SUCCESS, lockService.execute(LockType.TECH, String.valueOf(nodeId), () -> nodeService.recommendTechStack(nodeId)));
    }

    @PostMapping("/nodes/{nodeId}/tech-stack")
    public CommonResponse<Void> createCustomTechStack(@PathVariable Long nodeId, @RequestBody CustomTechCreateDto.Request request) {
        nodeService.createCustomTechStack(nodeId, request.getWorkspaceId(), request.getTechVocaId());
        return CommonResponse.success(SuccessCode.SUCCESS, null);
    }

    @Override
    @PostMapping("/nodes/custom")
    public CommonResponse<?> createCustom(@AuthenticationPrincipal Member member, @RequestBody CustomNodeDto.Request dto) {
        return CommonResponse.success(SuccessCode.SUCCESS, nodeService.createCustom(dto));
    }
}
