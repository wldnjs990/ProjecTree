package com.ssafy.projectree.domain.auth.usecase;

import com.ssafy.projectree.domain.auth.attribute.OAuthAttributes;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static com.ssafy.projectree.domain.auth.jwt.JwtProperties.*;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        Member member = saveOrUpdate(attributes);

        Map<String, Object> memberAttributes = new HashMap<>(attributes.getAttributes());
        memberAttributes.put(USERID, member.getId());
        memberAttributes.put(ROLE, member.getRole()); // SuccessHandler 처리를 위해 추가
        memberAttributes.put(PROVIDER, member.getOauthProvider());

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(member.getRole().name())),
                memberAttributes,
                attributes.getNameAttributeKey()
        );

    }
    private Member saveOrUpdate(OAuthAttributes attributes) {
        Member member = memberRepository.findByEmail(attributes.getEmail())
                .map(entity -> {
                    entity.setName(attributes.getName()); // 소셜 쪽 이름이 바뀌었을 경우 업데이트
                    return entity;
                })
                .orElse(attributes.toEntity()); // 없으면 GUEST 권한으로 생성

        return memberRepository.save(member);
    }
}
