package com.ssafy.projectree.domain.tech.usecase;

import com.ssafy.projectree.domain.tech.model.entity.WorkspaceTechStack;
import com.ssafy.projectree.domain.tech.model.repository.WorkspaceTechStackRepository;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkspaceTechStackService {

    private final TechStackService techStackService;
    private final WorkspaceTechStackRepository workspaceTechStackRepository;

    @Transactional
    public void create(List<Long> ids, Workspace workspace) {

        if (ids == null || ids.isEmpty()) {
            return;
        }

        for (Long id : ids) {
            WorkspaceTechStack workspaceTechStack = new WorkspaceTechStack();
            workspaceTechStack.setWorkspace(workspace);
            workspaceTechStack.setTechVocabulary(techStackService.findById(id));

            workspaceTechStackRepository.save(workspaceTechStack);
        }

    }

    public List<WorkspaceTechStack> findAllbyWorkspace(Workspace workspace) {
        return workspaceTechStackRepository.findALlByWorkspace(workspace);
    }

    @Transactional
    public void deleteByWorkspace(Workspace workspace) {
        log.info("[WORKSPACE] {}번 워크 스페이스의 기술 스택이 삭제되었습니다.", workspace.getId());
        workspaceTechStackRepository.deleteAllByWorkspace(workspace);
    }

}
