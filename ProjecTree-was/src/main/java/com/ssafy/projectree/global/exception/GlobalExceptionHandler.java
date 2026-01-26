package com.ssafy.projectree.global.exception;

import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.api.response.CommonResponse;
import com.ssafy.projectree.global.cache.CacheType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final List<Cache> caches;


    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<CommonResponse<?>> handleCustomException(BusinessLogicException e) {

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

    @ExceptionHandler(AIServiceException.class)
    public CommonResponse<Void> handleAiException(AIServiceException e){
        for(Cache cache : caches){
            if(cache.getName().equals(e.getCacheType().name())){
                CacheType cacheType = e.getCacheType();
                //TODO
            }
        }
        return CommonResponse.fail(e.getErrorCode(), e.getMessage());
    }
}
