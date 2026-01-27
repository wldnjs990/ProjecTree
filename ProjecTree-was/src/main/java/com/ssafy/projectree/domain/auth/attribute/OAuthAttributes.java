package com.ssafy.projectree.domain.auth.attribute;

import com.ssafy.projectree.domain.auth.enums.AuthRole;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.workspace.enums.Role;
import com.ssafy.projectree.global.model.enums.OAuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.User;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String name;
    private String email;
    private OAuthProvider oauthProvider;


    public static OAuthAttributes of(String registrationId, String userNameAttributeName, Map<String, Object> attributes) {
        // registrationId(google, github)를 Enum으로 변환
        OAuthProvider provider = OAuthProvider.valueOf(registrationId.toUpperCase());

        if (OAuthProvider.GITHUB.equals(provider)) {
            return ofGithub(userNameAttributeName, attributes);
        }
        return ofGoogle(userNameAttributeName, attributes);
    }

    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .oauthProvider(OAuthProvider.GOOGLE)
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    private static OAuthAttributes ofGithub(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .name((String) attributes.get("login")) // 깃허브 ID를 이름 대신 사용 (name이 null일 수 있음)
                .email((String) attributes.get("email"))
                .oauthProvider(OAuthProvider.GITHUB)
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    // 최초 가입 시 Member Entity 생성
    public Member toEntity() {
        return Member.builder()
                .name(name)
                .email(email)
                .oauthProvider(oauthProvider)
                .role(AuthRole.GUEST) // 중요: 가입 초기 권한은 GUEST
                .build();
    }
}
