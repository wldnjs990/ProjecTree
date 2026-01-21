package com.ssafy.projectree.global.api.response;


import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.api.code.SuccessCode;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommonResponse<T>{


    private String message;
    private boolean isSuccess;
    private T data;
    private int code;

    public static <T> CommonResponse<T> success(SuccessCode successCode, T body) {
        return success(successCode, body, successCode.getDefaultMessage());
    }

    public static <T> CommonResponse<T> success(SuccessCode successCode, T body, String message) {
        return CommonResponse.<T>builder()
                .isSuccess(true)
                .message(message)
                .data(body)
                .code(successCode.getValue())
                .build();
    }

    public static <T> CommonResponse<T> fail(T body, ErrorCode errorCode, String message) {
        return CommonResponse.<T>builder()
                .isSuccess(false)
                .message(message)
                .data(body)
                .code(errorCode.status())
                .build();
    }

    public static <T> CommonResponse<T> fail(ErrorCode errorCode, String message) {

        return fail(null, errorCode, message);
    }


}
