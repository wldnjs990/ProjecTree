package com.ssafy.projectree.domain.auth.jwt;

public class JwtProperties {
    public static final long ACCESS_TOKEN_EXPIRE_TIME = 1000L * 60 * 5;
    public static final long REFRESH_TOKEN_EXPIRE_TIME = 1000L * 60 * 24 * 7;
    public static final String PROVIDER = "OAuthProvider";
    public static final String AUTH_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String ACCESS_TOKEN_TYPE = "access";
    public static final String REFRESH_TOKEN_TYPE = "refresh";
    public static final String ROLE = "role";
    public static final String USERID = "id";
    public static final String TOKEN_TYPE = "tokenType";
}
