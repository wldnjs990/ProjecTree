package com.ssafy.projectree.domain.workspace.usecase;

import com.ssafy.projectree.domain.auth.utils.SecurityUtils;
import com.ssafy.projectree.domain.file.api.dto.FileReadDto;
import com.ssafy.projectree.domain.file.model.entity.FileProperty;
import com.ssafy.projectree.domain.file.model.repository.FileRepository;
import com.ssafy.projectree.domain.file.usecase.FileService;
import com.ssafy.projectree.domain.member.api.dto.MemberDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.domain.node.usecase.NodeService;
import com.ssafy.projectree.domain.tech.usecase.WorkspaceTechStackService;
import com.ssafy.projectree.domain.workspace.api.dto.FunctionSpecificationDto;
import com.ssafy.projectree.domain.workspace.api.dto.TeamDto;
import com.ssafy.projectree.domain.workspace.api.dto.WorkspaceDto;
import com.ssafy.projectree.domain.workspace.enums.Role;
import com.ssafy.projectree.domain.workspace.model.entity.FunctionSpecification;
import com.ssafy.projectree.domain.workspace.model.entity.Team;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.TeamRepository;
import com.ssafy.projectree.domain.workspace.model.repository.WorkspaceRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final TeamService teamService;
    private final FileService fileService;
    private final NodeService nodeService;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceTechStackService workspaceTechStackService;
    private final FunctionSpecificationService functionSpecificationService;
    private final TeamRepository teamRepository;
    private final FileRepository fileRepository;

    public List<WorkspaceDto.Response> read(Member member) {

        List<Long> ids = teamService.getAllWorkspacesId(member);
        List<WorkspaceDto.Response> myAllWorkspaces = new ArrayList<>();

        for (Long id : ids) {
            // WorkspaceDto.Response 객체에 담기
            Workspace workspace = findById(id);

            // 워크 스페이스별 조회 결과 리스트에 저장
            myAllWorkspaces.add(
                    WorkspaceDto.Response.builder()
                            .workspaceId(id)
                            .name(workspace.getName())
                            .description(workspace.getDescription())
                            .totalMembers(teamService.getMemberCount(workspace))
                            .role(teamService.getMemberRole(workspace, member))
                            .progress(nodeService.getStatistics(id))
                            .updatedAt(workspace.getUpdatedAt())
                            .build()
            );
        }

        return myAllWorkspaces;
    }

    public Workspace findById(Long id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.WORKSPACE_NOT_FOUND, "존재하지 않는 워크 스페이스입니다."));
    }

    @Transactional
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
        if (multipartFiles != null && !multipartFiles.isEmpty()) {
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

        // 기술명세 저장
        functionSpecificationService.create(workspace, dto.getEpics());

    }

    public WorkspaceDto.Detail details(Member member, Long workspaceId) {

        Workspace workspace = findById(workspaceId);
        Team team = teamService.findByWorkspaceAndMember(workspace, member);

        if (team == null || !team.getWorkspace().equals(workspace)) {
            throw new BusinessLogicException(ErrorCode.WORKSPACE_NOT_FOUND);
        }

        List<FileReadDto.Response> files = fileService.findByWorkspaceId(workspace);

        List<FunctionSpecification> functionSpecifications = functionSpecificationService.findAllByWorkspace(workspace);
        List<FunctionSpecificationDto.EpicInfo> epics = new ArrayList<>();

        for (FunctionSpecification fs : functionSpecifications) {
            epics.add(FunctionSpecificationDto.EpicInfo.builder()
                    .name(fs.getName())
                    .description(fs.getDescription())
                    .build()
            );
        }

        List<Team> teams = teamService.findAllByWorkspace(workspace);

        List<MemberDto.Info> memberInfos = teams.stream()
                .map(MemberDto.Info::from)
                .collect(Collectors.toList());

        TeamDto.Info teamInfo = TeamDto.Info.builder()
                .chatRoomId(teams.get(0).getChatRoom().getId())
                .memberInfos(memberInfos)
                .build();

        return WorkspaceDto.Detail.builder()
                .info(WorkspaceDto.Info.from(workspace))
                .nodeTree(nodeService.getNodeTree(workspaceId))
                .files(files)
                .epics(epics)
                .teamInfo(teamInfo)
                .build();
    }

    public Page<FileReadDto.Response> getWorkspaceFiles(int page, int size, Long workspaceId) {
        Member currentMember = SecurityUtils.getCurrentMember();
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow(() -> new BusinessLogicException(ErrorCode.WORKSPACE_NOT_FOUND));
        if (!teamRepository.isParticipant(workspace, currentMember)) {
            throw new BusinessLogicException(ErrorCode.MEMBER_NOT_FOUND_IN_WORKSPACE, "해당 워크스페이스에 참여중이지 않은 사용자입니다.");
        }
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<FileProperty> files = fileRepository.findByWorkspace(workspace, pageRequest);
        return files.map(file ->
                FileReadDto.Response.builder()
                        .originFileName(file.getOriginFileName())
                        .path(file.getPath())
                        .size(file.getSize())
                        .build()
        );
    }
}