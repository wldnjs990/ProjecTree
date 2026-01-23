package com.ssafy.projectree.domain.workspace.usecase;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.TeamRepository;
import com.ssafy.projectree.domain.workspace.model.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final TeamService teamService;
    // TODO: 노드별 progress 파악을 위해 추후에 필요.
//    private final NodeService nodeService;
    private final WorkspaceRepository workspaceRepository;

    public List<WorkspaceDto.Response> read() {
        Member member = null;


        return null;
    }

}