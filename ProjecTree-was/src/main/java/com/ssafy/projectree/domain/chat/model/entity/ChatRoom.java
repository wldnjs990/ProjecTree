package com.ssafy.projectree.domain.chat.model.entity;

import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
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
	@Column(length = 36)
	private String id;

	public ChatRoom(String id) {
		this.id = id;
	}

}

