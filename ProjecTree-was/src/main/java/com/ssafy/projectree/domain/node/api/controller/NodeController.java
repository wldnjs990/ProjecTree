package com.ssafy.projectree.domain.node.api.controller;

import com.ssafy.projectree.domain.node.api.dto.NodeDeleteDto;
import com.ssafy.projectree.domain.node.api.dto.NodeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class NodeController {

    @GetMapping("/node/{nodeId}")
    public CommonResponse<NodeReadDto.Response> getNodeDetails(
            @PathVariable Long nodeId
    ) {
        return CommonResponse.success(SuccessCode.SUCCESS, null);
    }

    @GetMapping("/workspace/{workspaceId}")
    public CommonResponse<NodeTreeReadDto.Response> getNodeTree(@PathVariable Long workspaceId) {
        return CommonResponse.success(SuccessCode.SUCCESS, null);
    }

    @PostMapping("/node/{nodeId}")
    public CommonResponse<NodeDeleteDto.Response> removeNode(@PathVariable Long nodeId) {
        return CommonResponse.success(SuccessCode.REMOVED, null);
    }
}
