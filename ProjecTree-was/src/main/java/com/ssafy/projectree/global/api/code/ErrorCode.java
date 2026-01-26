package com.ssafy.projectree.global.api.code;


import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND_ERROR(DomainCode.USER, ExceptionCode.NOT_FOUND, "USER_NOT_FOUND_ERROR"),
    WORKSPACE_VOICE_TOKEN_INVALID_REQUEST(DomainCode.WORKSPACE, ExceptionCode.INVALID,
            "roomName and participantName are required"),
    SERVER_ERROR(DomainCode.NORMAL, ExceptionCode.INTERNAL_SERVER_ERROR, "SERVER_ERROR"),
    CANDIDATE_GENERATE_ERROR(DomainCode.CANDIDATE,ExceptionCode.FAILURE ,"CANDIDATE_GENERATE_ERROR" ),
    NODE_GENERATE_ERROR(DomainCode.NODE, ExceptionCode.FAILURE, "NODE_GENERATE_ERROR"),
    TECH_RECOMMEND_ERROR(DomainCode.TECH, ExceptionCode.FAILURE, "TECH_FAILURE");
    private DomainCode domainCode;
    private ExceptionCode exceptionCode;
    @Getter
    private String defaultMessage;

    //10001
    public int status() {
        return domainCode.getValue() * 10000 + exceptionCode.getValue();
    }


}
