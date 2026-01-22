package com.ssafy.projectree.global.api.code;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SuccessCode {
    SUCCESS(200, "Successfully Completed"),
    CREATED(201, "Successfully Created"),
    UPDATED(202, "Successfully Updated"),
    REMOVED(203, "Successfully Removed");
    private int value;
    private String defaultMessage;
}