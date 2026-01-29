package com.ssafy.projectree.domain.node.api.controller;

import com.ssafy.projectree.domain.node.api.dto.NodePositionUpdateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeUpdateDto;
import com.ssafy.projectree.domain.node.usecase.NodeCrdtService;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/internal/workspaces/{workspaceId}")
@RequiredArgsConstructor
public class NodeInternalController {

    private final NodeCrdtService nodeCrdtService;

    @PatchMapping("/nodes/{nodeId}/detail")
    public CommonResponse<Void> saveNodeDetail(
            @PathVariable Long workspaceId,
            @PathVariable Long nodeId,
            @RequestBody NodeUpdateDto.Request request
    ) {
        nodeCrdtService.updateNodeDetail(nodeId, request);
        return CommonResponse.success(SuccessCode.UPDATED, null);
    }

    @PatchMapping("/nodes/positions")
    public CommonResponse<Void> updateNodePositions(
            @PathVariable Long workspaceId,
            @RequestBody NodePositionUpdateDto.Request request
    ) {
        nodeCrdtService.savePositionAsync(
                workspaceId,
                request.getNodes()
        );

        return CommonResponse.success(SuccessCode.UPDATED, null); // 202
    }
}
