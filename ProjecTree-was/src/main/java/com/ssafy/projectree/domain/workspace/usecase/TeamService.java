package com.ssafy.projectree.domain.workspace.usecase;

import com.ssafy.projectree.domain.chat.model.entity.ChatRoom;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.usecase.EmailService;
import com.ssafy.projectree.domain.member.usecase.MemberService;
import com.ssafy.projectree.domain.workspace.api.dto.TeamDto;
import com.ssafy.projectree.domain.workspace.enums.Role;
import com.ssafy.projectree.domain.workspace.model.entity.Team;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

    /**
     * workspace id를 통해 해당 workspace의 사용자가 몇명인지 확인
     * @param workspaceId
     * @return
     */
    private int getMemberCount(Long workspaceId) {
        return teamRepository.getMemberCountByWorkspaceId(workspaceId);
    }

    public void create(Member member, Workspace workspace, Map<String, Role> memberRoles) {

        ChatRoom chatRoom = chatService.create();

        Team team = new Team(member, workspace, chatRoom, Role.OWNER);
        teamRepository.save(team);

        if (memberRoles != null && !memberRoles.isEmpty()) {
            memberRoles.forEach((email, role) -> {
                Member teammate = memberService.findByEmail(email);

                Team newTeam = new Team(teammate, workspace, chatRoom, role);
                emailService.sendEmail(email, "https://i14d107.p.ssafy.io/workspace/" + workspace.getId());
                teamRepository.save(newTeam);
            });
        }

    }

}
