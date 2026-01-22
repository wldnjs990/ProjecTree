package com.ssafy.projectree.domain.workspace.usecase;

import com.ssafy.projectree.domain.workspace.model.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    /**
     * workspace id를 통해 해당 workspace의 사용자가 몇명인지 확인
     * @param workspaceId
     * @return
     */
    private int getMemberCount(Long workspaceId) {
        return teamRepository.getMemberCountByWorkspaceId(workspaceId);
    }

}
