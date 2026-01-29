package com.ssafy.projectree.global.api.code;


import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    USER_NOT_FOUND_ERROR(DomainCode.USER, ExceptionCode.NOT_FOUND, "USER_NOT_FOUND_ERROR"),
    NICKNAME_DUPLICATE_ERROR(DomainCode.USER, ExceptionCode.CONFLICT, "NICKNAME_DUPLICATE_ERROR"),
    WORKSPACE_VOICE_TOKEN_INVALID_REQUEST(DomainCode.WORKSPACE, ExceptionCode.INVALID,
            "roomName and participantName are required"),
    SERVER_ERROR(DomainCode.NORMAL, ExceptionCode.INTERNAL_SERVER_ERROR, "SERVER_ERROR"),
    CANDIDATE_GENERATE_ERROR(DomainCode.CANDIDATE, ExceptionCode.FAILURE, "CANDIDATE_GENERATE_ERROR"),
    NODE_GENERATE_ERROR(DomainCode.NODE, ExceptionCode.FAILURE, "NODE_GENERATE_ERROR"),
    TECH_RECOMMEND_ERROR(DomainCode.TECH, ExceptionCode.FAILURE, "TECH_FAILURE"),
    CANDIDATE_NOT_FOUND_ERROR(DomainCode.CANDIDATE, ExceptionCode.NOT_FOUND, "CANDIDATE_NOT_FOUND"),
    NODE_NOT_FOUND_ERROR(DomainCode.NODE, ExceptionCode.NOT_FOUND, "NODE_NOT_FOUND_ERROR"),
    NODE_TYPE_NOT_SUPPORT_ERROR(DomainCode.NODE, ExceptionCode.NOT_SUPPORT, "NODE_TYPE_NOT_SUPPORT"),
    JWT_CREATE_FAILURE_ERROR(DomainCode.USER, ExceptionCode.NOT_SUPPORT, "NOT_SUPPORT_USER"),
    TOKEN_EXPIRED(DomainCode.AUTH, ExceptionCode.EXPIRED, "TOKEN_EXPIRED - AccessToken 만료시 해당 에러 발급"),
    TOKEN_MALFORMED(DomainCode.AUTH, ExceptionCode.MALFORMED, "TOKEN_MALFORMED - 토큰 위조됨" ),
    TOKEN_INVALID_SIGNATURE(DomainCode.AUTH, ExceptionCode.INVALID,"TOKEN_INVALID_SIGNATURE - 서명 불일치" ),
    TOKEN_EMPTY(DomainCode.AUTH, ExceptionCode.EMPTY,"TOKEN_EMPTY-토큰 비어있음" ),
    UN_EXPECTED_TOKEN_VALIDATION(DomainCode.AUTH, ExceptionCode.UN_EXPECTED ,"UN_EXPECTED - 예기치 못한 토큰" ),
    WORKSPACE_NOT_FOUND(DomainCode.WORKSPACE, ExceptionCode.NOT_FOUND, "WORKSPACE_NOT_FOUND"),
    TECHSTACK_NOT_FOUND(DomainCode.TECH, ExceptionCode.NOT_FOUND, "TECHSTACK_NOT_FOUND");

    private DomainCode domainCode;
    private ExceptionCode exceptionCode;
    private String defaultMessage;

    //10001
    public int status() {
        return domainCode.getValue() * 10000 + exceptionCode.getValue();
    }


}
