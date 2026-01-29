package com.ssafy.projectree.domain.workspace.usecase;

import com.ssafy.projectree.domain.file.usecase.FileService;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.node.usecase.NodeService;
import com.ssafy.projectree.domain.workspace.api.dto.TeamDto;
import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.domain.workspace.enums.Role;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.WorkspaceRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final TeamService teamService;
    private final FileService fileService;
    // TODO: 노드별 progress 파악을 위해 추후에 필요.
    private final NodeService nodeService;
    private final WorkspaceRepository workspaceRepository;

    public List<WorkspaceDto.Response> read() {
        Member member = null;


        return null;
    }

    public Workspace findById(Long id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.WORKSPACE_NOT_FOUND, "존재하지 않는 워크 스페이스입니다."));
    }

    public void create(Member member, WorkspaceDto.Insert dto, List<MultipartFile> multipartFiles) throws IOException {

        Workspace workspace = Workspace.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .serviceType(dto.getServiceType())
                .domain(dto.getDomain())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .purpose(dto.getPurpose())
                .identifierPrefix(dto.getIdentifierPrefix())
                .build();

        workspaceRepository.save(workspace);

        if (!multipartFiles.isEmpty()) {
            fileService.upload(multipartFiles, workspace);
        }

        List<TeamDto.Join> teammates = new ArrayList<>();
        teammates.add(TeamDto.Join.of(member, Role.OWNER));

        teamService.create(member, workspace, dto.getMemberRoles());

    }

}