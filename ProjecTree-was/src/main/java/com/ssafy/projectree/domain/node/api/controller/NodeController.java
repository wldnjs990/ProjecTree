package com.ssafy.projectree.domain.node.api.controller;

import com.ssafy.projectree.domain.node.api.dto.NodeReadDto;
import com.ssafy.projectree.domain.node.api.dto.NodeTreeReadDto;
import com.ssafy.projectree.global.api.code.SuccessCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.docs.NodeDocsController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class NodeController implements NodeDocsController {

    @GetMapping("/nodes/{node-id}")
    public CommonResponse<NodeReadDto.Response> getNodeDetails(
            @PathVariable(value = "node-id") Long nodeId
    ) {
        return CommonResponse.success(SuccessCode.SUCCESS, null);
    }

    @GetMapping("/workspaces/{workspace-id}")
    public CommonResponse<NodeTreeReadDto.Response> getNodeTree(@PathVariable(value = "workspace-id") Long workspaceId) {
        return CommonResponse.success(SuccessCode.SUCCESS, null);
    }

}
