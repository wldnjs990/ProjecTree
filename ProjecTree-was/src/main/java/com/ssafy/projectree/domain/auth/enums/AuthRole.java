package com.ssafy.projectree.domain.auth.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Getter
@RequiredArgsConstructor
public enum AuthRole implements GrantedAuthority {
    GUEST("ROLE_GUEST"),
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");
    private final String key;

    public static AuthRole getRole(String key){
        return AuthRole.valueOf(key);
    }

    @Override
    public String getAuthority() {
        return key;
    }
}
