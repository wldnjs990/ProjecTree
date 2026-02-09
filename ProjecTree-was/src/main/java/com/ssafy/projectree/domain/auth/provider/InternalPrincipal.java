package com.ssafy.projectree.domain.auth.provider;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

@Getter
public class InternalPrincipal {

    private final String subject;

    public InternalPrincipal(String subject) {
        this.subject = subject;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_INTERNAL"));
    }
}