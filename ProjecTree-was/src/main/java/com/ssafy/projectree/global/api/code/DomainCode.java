package com.ssafy.projectree.global.api.code;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DomainCode {
    USER(1),
    WORKSPACE(2),
    NORMAL(99);
    private int value;
}