package com.ssafy.projectree.domain.auth.jwt;

import com.ssafy.projectree.domain.auth.enums.AuthRole;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.global.model.enums.OAuthProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

import static com.ssafy.projectree.domain.auth.jwt.JwtProperties.*;

@Component
@RequiredArgsConstructor
public class JwtResolver {

    @Value("${JWT_SECRET}")
    private String secret;

    private SecretKey secretKey;

    @PostConstruct
    private void init() {
        secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public Member resolve(String header) {
        String token = extractTokenFromHeader(header);
        return parse(token, ACCESS_TOKEN_TYPE);
    }

    public Member parse(String token, String tokenType) {
        Claims payload = getClaims(token);

        if (!payload.get(TOKEN_TYPE).equals(tokenType)) {
            throw new MalformedJwtException("토큰 타입이 위조되었습니다.");
        }

        return Member.builder()
                .id(payload.get(USERID, Long.class))
                .role(AuthRole.getRole(payload.get(ROLE, String.class)))
                .oauthProvider(OAuthProvider.valueOf(payload.get(PROVIDER, String.class)))
                .build();

    }


    private String extractTokenFromHeader(String header) {
        if (header.startsWith(TOKEN_PREFIX)) {
            return header.substring(TOKEN_PREFIX.length());
        } else {
            throw new JwtException("잘못된 토큰 형식입니다.");
        }
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException ex) {
            throw ex;
        }
    }
}
