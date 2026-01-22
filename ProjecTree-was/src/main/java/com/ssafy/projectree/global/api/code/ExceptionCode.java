package com.ssafy.projectree.global.api.code;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ExceptionCode {
    EMPTY(0),
    NOT_FOUND(1),
    NOT_SUPPORT(2),
    UN_EXPECTED(5),
    EXPIRED(6),
    MALFORMED(7),
    INVALID(8), FAILURE(4), CONFLICT(9), FORBIDDEN(3),
    INTERNAL_SERVER_ERROR(55), TOO_MANY_REQUEST(29);
    private int value;

}