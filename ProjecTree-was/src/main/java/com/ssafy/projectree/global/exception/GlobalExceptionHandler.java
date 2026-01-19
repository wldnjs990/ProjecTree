package com.ssafy.projectree.global.exception;

import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CommonResponse<?>> handleCustomException(CustomException e) {

        ErrorCode code = e.getErrorCode();

        CommonResponse<?> res = CommonResponse.fail(
                code, code.getDefaultMessage()
        );

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<?>> handleException(Exception e) {

        CommonResponse<?> res = CommonResponse.fail(
                ErrorCode.SERVER_ERROR, ErrorCode.SERVER_ERROR.getDefaultMessage()
        );

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


}
