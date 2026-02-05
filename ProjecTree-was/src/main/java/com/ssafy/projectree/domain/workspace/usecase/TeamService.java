package com.ssafy.projectree.domain.workspace.usecase;

import com.ssafy.projectree.domain.chat.model.entity.ChatRoom;
import com.ssafy.projectree.domain.chat.usecase.ChatRoomService;
import com.ssafy.projectree.domain.member.api.dto.MemberDto;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.usecase.EmailService;
import com.ssafy.projectree.domain.member.usecase.MemberService;
import com.ssafy.projectree.domain.workspace.api.dto.TeamDto;
import com.ssafy.projectree.domain.workspace.enums.Role;
import com.ssafy.projectree.domain.workspace.model.entity.Team;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.TeamRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeamService {

    private final ChatService chatService;
    private final EmailService emailService;
    private final TeamRepository teamRepository;
    private final MemberService memberService;
    private final ChatRoomService chatRoomService;

    @Value("${workspace.invite_url}")
    private String baseUrl;

    /**
     * workspace id를 통해 해당 workspace의 사용자가 몇명인지 확인
     *
     * @param workspace
     * @return
     */
    public int getMemberCount(Workspace workspace) {
        return teamRepository.countByWorkspace(workspace);
    }

    public void create(Member member, Workspace workspace, Map<String, Role> memberRoles) {

        ChatRoom chatRoom = chatService.create();

        Team team = new Team(member, workspace, chatRoom, Role.OWNER);
        teamRepository.save(team);

        if (memberRoles != null && !memberRoles.isEmpty()) {
            memberRoles.forEach((email, role) -> {
                Member teammate = memberService.findByEmail(email);

                Team newTeam = new Team(teammate, workspace, chatRoom, role);
                emailService.sendEmail(email, baseUrl + workspace.getId());
                teamRepository.save(newTeam);
            });
        }

    }

    public List<Long> getAllWorkspacesId(Member member) {

        List<Team> myTeams = teamRepository.findAllByMember(member);
        List<Long> workspacesId = new ArrayList<>();

        for (Team team : myTeams) {
            workspacesId.add(team.getWorkspace().getId());
        }

        return workspacesId;
    }

    public Role getMemberRole(Workspace workspace, Member member) {
        Team team = findByWorkspaceAndMember(workspace, member);

        return team.getRole();
    }

    public TeamDto.UpdateRoleResponse changeRole(Member member, Workspace workspace, TeamDto.UpdateRoleRequest dto) {
        List<Team> teams = findAllByWorkspace(workspace);

        if (!getMemberRole(workspace, member).equals(Role.OWNER)) {
            throw new BusinessLogicException(ErrorCode.CHANGE_ROLE_REJECTED);
        }

        Member targetMember = memberService.findById(dto.getTargetMemberId());

        for (Team team : teams) {
            if (team.getMember().equals(targetMember)) {
                team.setRole(dto.getRole());
                break;
            }
        }

        return TeamDto.UpdateRoleResponse.builder()
                .memberId(targetMember.getId())
                .role(dto.getRole())
                .build();
    }

    public Team findByWorkspaceAndMember(Workspace workspace, Member member) {
        Team team = teamRepository.findByWorkspaceAndMember(workspace, member)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.MEMBER_NOT_FOUND_IN_WORKSPACE));

        return team;
    }

    public List<Team> findAllByWorkspace(Workspace workspace) {
        List<Team> teams = teamRepository.findByWorkspace(workspace)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.MEMBER_NOT_FOUND_IN_WORKSPACE));

        return teams;
    }

    public List<Member> getMembers(List<Team> teams) {

        List<Member> members = new ArrayList<>();
        for (Team team : teams) {
            members.add(team.getMember());
        }

        return members;
    }

    @Transactional
    public MemberDto.Info invite(Member member, Workspace workspace, TeamDto.Invite dto) {

        Team team = findByWorkspaceAndMember(workspace, member);
        Role memberRole = team.getRole();

        ChatRoom chatRoom = chatRoomService.findById(dto.getChatRoomId());

        if (!memberRole.equals(Role.OWNER)) {
            throw new BusinessLogicException(ErrorCode.INVITE_MEMBER_REJECTED);
        }

        Member newMember = memberService.findByEmail(dto.getEmail());
        if (newMember.isDeleted() || newMember == null) {
            throw new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR, "존재하지 않는 사용자입니다.");
        }

        Team newTeammate = new Team(newMember, workspace, chatRoom, dto.getRole());
        teamRepository.save(newTeammate);

        emailService.sendEmail(dto.getEmail(), baseUrl + dto.getWorkspaceId());

        return MemberDto.Info.from(newTeammate);
    }
}
