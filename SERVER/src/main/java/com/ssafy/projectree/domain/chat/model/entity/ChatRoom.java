package com.ssafy.projectree.domain.chat.model.entity;

import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "chat_room")
@NoArgsConstructor
public class ChatRoom extends BaseEntity {

	@Id
	@Column(columnDefinition = "VARCHAR(36)")
	private String id;

	public ChatRoom(String id) {
		this.id = id;
	}

}

