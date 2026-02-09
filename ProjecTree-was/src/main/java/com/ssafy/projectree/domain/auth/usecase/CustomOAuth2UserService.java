package com.ssafy.projectree.domain.auth.usecase;

import com.ssafy.projectree.domain.auth.attribute.OAuthAttributes;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Log4j2 대신 Slf4j를 많이 쓰지만, 쓰시던 거면 Log4j2 유지하셔도 됩니다.
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ssafy.projectree.domain.auth.jwt.JwtProperties.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final RestClient restClient;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());

        // 3. GitHub이고 이메일이 없는 경우 처리
        if ("github".equals(registrationId)) {
            String email = (String) attributes.get("email");

            // 이메일이 없거나 비어있으면 API 호출
            if (email == null || email.isBlank()) {
                String accessToken = userRequest.getAccessToken().getTokenValue();
                String realEmail = getGithubEmail(accessToken);

                if (realEmail != null) {
                    attributes.put("email", realEmail); // 가져온 이메일로 맵 업데이트
                }
            }
        }

        OAuthAttributes extractAttributes = OAuthAttributes.of(registrationId, userNameAttributeName, attributes);
        Member member = saveOrUpdate(extractAttributes);

        Map<String, Object> memberAttributes = new HashMap<>(attributes);
        memberAttributes.put(USERID, member.getId());
        memberAttributes.put(ROLE, member.getRole());
        memberAttributes.put(PROVIDER, member.getOauthProvider());

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(member.getRole().name())),
                memberAttributes,
                extractAttributes.getNameAttributeKey()
        );
    }

    private String getGithubEmail(String accessToken) {
        try {
            List<Map<String, Object>> emails = restClient.get()
                    .uri("https://api.github.com/user/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});

            if (emails != null) {
                return emails.stream()
                        .filter(m -> Boolean.TRUE.equals(m.get("primary"))) // 주 사용 이메일
                        // .filter(m -> Boolean.TRUE.equals(m.get("verified"))) // 인증된 이메일만 필요시
                        .map(m -> (String) m.get("email"))
                        .findFirst()
                        .orElse(null);
            }
        } catch (Exception e) {
            log.error("GitHub 이메일 API 호출 실패: {}", e.getMessage());
        }
        return null;
    }

    private Member saveOrUpdate(OAuthAttributes attributes) {
        Member member = memberRepository.findByEmail(attributes.getEmail())
                .map(entity -> {
                    entity.setName(attributes.getName());
                    return entity;
                })
                .orElse(attributes.toEntity());

        return memberRepository.save(member);
    }
}