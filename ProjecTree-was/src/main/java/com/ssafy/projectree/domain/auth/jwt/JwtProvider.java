package com.ssafy.projectree.domain.auth.jwt;

import com.ssafy.projectree.domain.member.model.entity.Member;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static com.ssafy.projectree.domain.auth.jwt.JwtProperties.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtProvider {

    @Value("${JWT_SECRET}")
    private String secret;

    public Jwt generate(Member member) {
        String access = create(member, ACCESS_TOKEN_EXPIRE_TIME, ACCESS_TOKEN_TYPE);
        String refresh = create(member, REFRESH_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_TYPE);

        return new Jwt(access, refresh);
    }

    public Jwt generate(OAuth2User oAuth2User){
        String access = create(oAuth2User, ACCESS_TOKEN_EXPIRE_TIME, ACCESS_TOKEN_TYPE);
        String refresh = create(oAuth2User, REFRESH_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_TYPE);

        return new Jwt(access, refresh);
    }

    private String create(OAuth2User member, long time, String tokenType) {

        Date expiredDate = new Date();
        expiredDate.setTime(expiredDate.getTime() + time);

        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .claim(USERID, member.getAttribute("email"))
                .claim(ROLE, member.getAttribute("role"))
                .claim(PROVIDER, member.getAttribute(""))
                .claim("tokenType", tokenType)
                .expiration(expiredDate)
                .issuedAt(new Date())
                .signWith(secretKey)
                .compact();
    }


    private String create(Member member, long time, String tokenType) {

        Date expiredDate = new Date();
        expiredDate.setTime(expiredDate.getTime() + time);

        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .claim(USERID, member.getEmail())
                .claim(ROLE, member.getRole().name())
                .claim(PROVIDER, member.getOauthProvider())
                .claim("tokenType", tokenType)
                .expiration(expiredDate)
                .issuedAt(new Date())
                .signWith(secretKey)
                .compact();
    }
}