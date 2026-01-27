package com.ssafy.projectree.domain.member.model.entity;

import com.ssafy.projectree.domain.auth.enums.AuthRole;
import com.ssafy.projectree.global.model.entity.BaseEntity;
import com.ssafy.projectree.global.model.enums.OAuthProvider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Member extends BaseEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String nickname;
    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private AuthRole role;

    @Enumerated(EnumType.STRING)
    private OAuthProvider oauthProvider;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(role);
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return email;
    }
}