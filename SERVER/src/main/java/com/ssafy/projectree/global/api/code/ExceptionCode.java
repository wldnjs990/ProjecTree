package com.ssafy.projectree.global.api.code;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ExceptionCode {
    MALFORMED(400),
    INVALID(401),
    FORBIDDEN(403),
    NOT_FOUND(404),
    EXPIRED(408),
    CONFLICT(409),
    UN_EXPECTED(417),
    EMPTY(422),
    TOO_MANY_REQUEST(429),
    INTERNAL_SERVER_ERROR(500),
    FAILURE(501),
    NOT_SUPPORT(505);
    private int value;

}