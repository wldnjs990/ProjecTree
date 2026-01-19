package com.ssafy.projectree.global.api.code;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND_ERROR(DomainCode.USER, ExceptionCode.NOT_FOUND, "USER_NOT_FOUND_ERROR"),
    SERVER_ERROR(DomainCode.NORMAL, ExceptionCode.INTERNAL_SERVER_ERROR, "SERVER_ERROR"),
    ;
    private DomainCode domainCode;
    private ExceptionCode exceptionCode;
    @Getter
    private String defaultMessage;

    //4040101
    public int status() {
        return domainCode.getValue() * 10000 + exceptionCode.getValue();
    }


}
