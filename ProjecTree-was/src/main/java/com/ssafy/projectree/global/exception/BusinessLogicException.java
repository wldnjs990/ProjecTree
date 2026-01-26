package com.ssafy.projectree.global.exception;

import com.ssafy.projectree.global.api.code.ErrorCode;

public class BusinessLogicException extends CustomException{
    public BusinessLogicException(ErrorCode errorCode) {
        super(errorCode);
    }

    public BusinessLogicException(ErrorCode errorCode, Throwable cause) {
        super(errorCode, cause);
    }
}
