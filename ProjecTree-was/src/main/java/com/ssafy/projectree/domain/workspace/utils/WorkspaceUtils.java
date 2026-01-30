package com.ssafy.projectree.domain.workspace.utils;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.node.model.repository.NodeRepository;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WorkspaceUtils {
    private final WorkspaceRepository workspaceRepository;
    private final NodeRepository nodeRepository;

}
