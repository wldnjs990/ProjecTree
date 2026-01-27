package com.ssafy.projectree.domain.node.api.controller;

import com.ssafy.projectree.domain.node.api.dto.NodePositionUpdateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeUpdateDto;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/internal/workspaces/{workspaceId}")
@RequiredArgsConstructor
public class NodeInternalController {

    @PostMapping("/nodes/{nodeId}/detail")
    public CommonResponse<Void> saveNodeDetail(
            @PathVariable Long workspaceId,
            @PathVariable Long nodeId,
            @RequestBody NodeUpdateDto.Request request
    ) {

        log.info("NodeDetail save request:{}", request);
        return CommonResponse.success(SuccessCode.UPDATED, null);
    }

    @PutMapping("/nodes/positions")
    public CommonResponse<Void> updateNodePositions(
            @PathVariable Long workspaceId,
            @RequestBody NodePositionUpdateDto.Request request
    ) {

        log.info("NodePosition update request:{}", request);

        // TODO: 배치처리 필요

        return CommonResponse.success(SuccessCode.UPDATED, null);
    }
}
