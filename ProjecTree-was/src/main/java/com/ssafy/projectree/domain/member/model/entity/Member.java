package com.ssafy.projectree.domain.member.model.entity;

import com.ssafy.projectree.global.model.entity.BaseEntity;
import com.ssafy.projectree.global.model.enums.OAuthProvider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Member extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String nickname;
    private String email;

    @Enumerated(EnumType.STRING)
    private OAuthProvider oauthProvider;
}