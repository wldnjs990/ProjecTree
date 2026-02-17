package com.ssafy.projectree.global.api.code;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DomainCode {
    USER(1),
    WORKSPACE(2),
    NORMAL(99),
    CANDIDATE(3),
    NODE(4),
    TECH(5),
    AUTH(6),
    CHATROOM(7),
    PORTFOLIO(8),
    TEAM(9),
    FILE(10);
    private int value;
}