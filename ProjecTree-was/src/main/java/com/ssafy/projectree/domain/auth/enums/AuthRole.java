package com.ssafy.projectree.domain.auth.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Getter
@RequiredArgsConstructor
public enum AuthRole implements GrantedAuthority {
    ROLE_GUEST("ROLE_GUEST"),
    ROLE_USER("ROLE_USER"),
    ROLE_ADMIN("ROLE_ADMIN");
    private final String key;

    public static AuthRole getRole(String key){
        return AuthRole.valueOf(key);
    }

    @Override
    public String getAuthority() {
        return key;
    }
}
