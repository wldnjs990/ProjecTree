package com.ssafy.projectree.domain.workspace.usecase;

import com.ssafy.projectree.domain.file.usecase.FileService;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.domain.node.usecase.NodeService;
import com.ssafy.projectree.domain.tech.usecase.WorkspaceTechStackService;
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
    private final NodeService nodeService;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceTechStackService workspaceTechStackService;

    public List<WorkspaceDto.Response> read(Member member) {
        List<Long> ids = teamService.getAllWorkspacesId(member);

        for (Long id : ids) {
            // WorkspaceDto.Response 객체에 담기
            nodeService.getNodeTree(id);


        }


        return null;
    }

    public Workspace findById(Long id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.WORKSPACE_NOT_FOUND, "존재하지 않는 워크 스페이스입니다."));
    }

    public void create(Member member, WorkspaceDto.Insert dto, List<MultipartFile> multipartFiles) throws IOException {
        // 워크 스페이스 생성
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

        // 워크 스페이스의 기획 문서 저장
        if (!multipartFiles.isEmpty()) {
            fileService.uploadFiles(multipartFiles, workspace);
        }

        // 워크 스페이스의 팀 구성을 위한 팀 저장
        List<TeamDto.Join> teammates = new ArrayList<>();
        teammates.add(TeamDto.Join.of(member, Role.OWNER));

        teamService.create(member, workspace, dto.getMemberRoles());

        // 프로젝트 노드 생성
        ProjectNode projectNode = nodeService.createProjectNode(workspace);
        
        // 에픽 노드 생성
        nodeService.createEpicNodes(workspace, projectNode, dto.getEpics());

        // 워크 스페이스 기술 스택 저장
        workspaceTechStackService.create(dto.getWorkspaceTechStacks(), workspace);

    }

}