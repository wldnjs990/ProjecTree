package com.ssafy.projectree.domain.node.api.controller;

import com.ssafy.projectree.domain.node.api.dto.NodePositionUpdateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTechSelectDto;
import com.ssafy.projectree.domain.node.api.dto.NodeUpdateDto;
import com.ssafy.projectree.domain.node.usecase.NodeCrdtService;
import com.ssafy.projectree.domain.node.usecase.NodeService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/internal/nodes")
@RequiredArgsConstructor
public class NodeInternalController {

    private final NodeCrdtService nodeCrdtService;
    private final NodeService nodeService;

    @PatchMapping("/{nodeId}/detail")
    public CommonResponse<Void> saveNodeDetail(
            @PathVariable Long nodeId,
            @RequestBody NodeUpdateDto.Request request
    ) {
        nodeService.updateNodeDetail(nodeId, request);
        return CommonResponse.success(SuccessCode.UPDATED, null);
    }

    @PatchMapping("/positions")
    public CommonResponse<Void> updateNodePositions(
            @RequestBody NodePositionUpdateDto.Request request
    ) {
        nodeCrdtService.savePositionAsync(
                request.getNodes()
        );

        return CommonResponse.success(SuccessCode.UPDATED, null); // 202
    }

    @PostMapping("/{nodeId}/tech")
    public CommonResponse<Void> selectNodeTech(
            @PathVariable Long nodeId, @RequestBody NodeTechSelectDto.Request request
    ) {

        nodeService.selectNodeTech(nodeId, request.getSelectedTechId());
        return CommonResponse.success(SuccessCode.UPDATED, null);
    }

    @DeleteMapping("/{nodeId}")
    public CommonResponse<Void> deleteNode(
            @PathVariable Long nodeId
    ) {
        nodeService.deleteNode(nodeId);
        return CommonResponse.success(SuccessCode.UPDATED, null);
    }

}
