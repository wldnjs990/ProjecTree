package com.ssafy.projectree.global.exception;

import com.ssafy.projectree.global.api.code.ErrorCode;
import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

    ErrorCode errorCode;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    public CustomException(ErrorCode errorCode, Throwable cause) {
        super(errorCode.getDefaultMessage(), cause);
        this.errorCode = errorCode;
    }
}

