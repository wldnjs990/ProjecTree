package com.ssafy.projectree.domain.workspace.usecase;

import com.ssafy.projectree.domain.workspace.api.dto.FunctionSpecificationDto;
import com.ssafy.projectree.domain.workspace.model.entity.FunctionSpecification;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.FunctionSpecificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FunctionSpecificationService {

    private final FunctionSpecificationRepository functionSpecificationRepository;

    public void create(Workspace workspace, List<FunctionSpecificationDto.EpicInfo> epics) {

        for (FunctionSpecificationDto.EpicInfo epic : epics) {
            functionSpecificationRepository.save(new FunctionSpecification(workspace, epic.getName(), epic.getDescription()));
        }

    }

    public List<FunctionSpecification> findAllByWorkspace(Workspace workspace) {
        return functionSpecificationRepository.findAllByWorkspace(workspace);
    }

}
