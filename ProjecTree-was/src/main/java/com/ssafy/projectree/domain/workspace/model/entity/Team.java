package com.ssafy.projectree.domain.workspace.model.entity;

import com.ssafy.projectree.domain.chat.model.entity.ChatRoom;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.enums.Role;
import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
		name = "team",
		uniqueConstraints = {
				@UniqueConstraint(columnNames = {"member_id", "workspace_id"})
		}
)
public class Team extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "workspace_id", nullable = false)
	private Workspace workspace;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chat_id")
	private ChatRoom chatRoom;

	@Column(name = "role")
	@Enumerated(EnumType.STRING)
	private Role role;

	public Team(Member member, Workspace workspace, ChatRoom chatRoom, Role role) {
		this.member = member;
		this.workspace = workspace;
		this.chatRoom = chatRoom;
		this.role = role;
	}
}
