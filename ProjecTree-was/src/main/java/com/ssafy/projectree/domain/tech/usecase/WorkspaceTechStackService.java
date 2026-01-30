package com.ssafy.projectree.domain.tech.usecase;

import com.ssafy.projectree.domain.tech.model.entity.WorkspaceTechStack;
import com.ssafy.projectree.domain.tech.model.repository.WorkspaceTechStackRepository;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkspaceTechStackService {

    private final TechVocabularyService techVocabularyService;
    private final WorkspaceTechStackRepository workspaceTechStackRepository;

    @Transactional
    public void create(List<Long> ids, Workspace workspace) {

        for (Long id : ids) {
            WorkspaceTechStack workspaceTechStack = new WorkspaceTechStack();
            workspaceTechStack.setWorkspace(workspace);
            workspaceTechStack.setTechVocabulary(techVocabularyService.findById(id));

            workspaceTechStackRepository.save(workspaceTechStack);
        }

    }

}
