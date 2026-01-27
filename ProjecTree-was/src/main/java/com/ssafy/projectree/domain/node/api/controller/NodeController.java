package com.ssafy.projectree.domain.node.api.controller;

import com.ssafy.projectree.domain.node.api.dto.*;
import com.ssafy.projectree.domain.node.usecase.NodeService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.NodeDocsController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class NodeController implements NodeDocsController {
    private final NodeService nodeService;

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
                                                             @RequestBody NodeCreateDto.Request request){
        return CommonResponse.success(SuccessCode.SUCCESS, nodeService.createNode(candidateId, parentId,request));
    }

    @PostMapping("/nodes/{node-id}/candidates")
    public CommonResponse<CandidateCreateDto.Response> createCandidates(@PathVariable(name = "node-id") Long parentId){
        return CommonResponse.success(SuccessCode.SUCCESS, nodeService.createCandidate(parentId));
    }

    @PostMapping("/nodes/{node-id}/tech-stack/recommendation")
    public CommonResponse<TechStackRecommendDto.Response> recommendTechStack(@PathVariable(name = "node-id")Long nodeId){
        return CommonResponse.success(SuccessCode.SUCCESS,  nodeService.recommendTechStack(nodeId));
    }


}
