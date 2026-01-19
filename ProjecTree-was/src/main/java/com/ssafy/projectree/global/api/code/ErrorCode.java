package com.ssafy.projectree.global.api.code;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND_ERROR(HttpStatus.NOT_FOUND, DomainCode.USER, ExceptionCode.NOT_FOUND, "USER_NOT_FOUND_ERROR"),
    ;

    private HttpStatus httpStatus;
    private DomainCode domainCode;
    private ExceptionCode exceptionCode;
    @Getter
    private String defaultMessage;

    //4040101
    public int status() {
        return httpStatus.value() * 10000 + domainCode.getValue() * 100 + exceptionCode.getValue();
    }


}
