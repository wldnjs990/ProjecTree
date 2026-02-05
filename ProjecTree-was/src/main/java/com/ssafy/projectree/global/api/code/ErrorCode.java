package com.ssafy.projectree.global.api.code;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    USER_NOT_FOUND_ERROR(DomainCode.USER, ExceptionCode.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    NICKNAME_DUPLICATE_ERROR(DomainCode.USER, ExceptionCode.CONFLICT, "닉네임이 중복 됩니다."),
    WORKSPACE_VOICE_TOKEN_INVALID_REQUEST(DomainCode.WORKSPACE, ExceptionCode.INVALID,
            "방 이름과 참여자 이름이 필요합니다."),
    SERVER_ERROR(DomainCode.NORMAL, ExceptionCode.INTERNAL_SERVER_ERROR, "서버 오류입니다."),
    CANDIDATE_GENERATE_ERROR(DomainCode.CANDIDATE, ExceptionCode.FAILURE, "후보 생성 중 실패하였습니다."),
    NODE_GENERATE_ERROR(DomainCode.NODE, ExceptionCode.FAILURE, "노드 생성중 실패하였습니다"),
    TECH_RECOMMEND_ERROR(DomainCode.TECH, ExceptionCode.FAILURE, "기술 추천 중 실패하였습니다."),
    PORTFOLIO_GENERATE_ERROR(DomainCode.PORTFOLIO, ExceptionCode.FAILURE, "포트폴리오 생성 중 실패하였습니다."),
    CANDIDATE_NOT_FOUND_ERROR(DomainCode.CANDIDATE, ExceptionCode.NOT_FOUND, "후보 노드를 찾을 수 없습니다."),
    NODE_NOT_FOUND_ERROR(DomainCode.NODE, ExceptionCode.NOT_FOUND, "노드를 찾을 수 없습니다."),
    NODE_TYPE_NOT_SUPPORT_ERROR(DomainCode.NODE, ExceptionCode.NOT_SUPPORT, "지원되지 않는 노드 형식입니다."),
    JWT_CREATE_FAILURE_ERROR(DomainCode.USER, ExceptionCode.NOT_SUPPORT, "지원되지 않는 사용자 입니다."),
    TOKEN_EXPIRED(DomainCode.AUTH, ExceptionCode.EXPIRED, "TOKEN_EXPIRED - AccessToken 만료시 해당 에러 발급"),
    TOKEN_MALFORMED(DomainCode.AUTH, ExceptionCode.MALFORMED, "TOKEN_MALFORMED - 토큰 위조됨"),
    TOKEN_INVALID_SIGNATURE(DomainCode.AUTH, ExceptionCode.INVALID, "TOKEN_INVALID_SIGNATURE - 서명 불일치"),
    TOKEN_EMPTY(DomainCode.AUTH, ExceptionCode.EMPTY, "TOKEN_EMPTY-토큰 비어있음"),
    UN_EXPECTED_TOKEN_VALIDATION(DomainCode.AUTH, ExceptionCode.UN_EXPECTED, "UN_EXPECTED - 예기치 못한 토큰"),
    WORKSPACE_NOT_FOUND(DomainCode.WORKSPACE, ExceptionCode.NOT_FOUND, "워크스페이스 정보를 찾을 수 없습니다."),
    TECHSTACK_NOT_FOUND(DomainCode.TECH, ExceptionCode.NOT_FOUND, "기술 스택 정보를 찾을 수 없습니다."),
    MEMBER_NOT_FOUND_IN_WORKSPACE(DomainCode.WORKSPACE, ExceptionCode.CONFLICT, "워크스페이스 내의 멤버를 찾을 수 없습니다."),
    AUTHENTICATION_REQUIRED(DomainCode.AUTH, ExceptionCode.INVALID, "인증되지 않은 사용자입니다."),
    ACCESS_DENIED(DomainCode.AUTH, ExceptionCode.FORBIDDEN, "인가되지 않은 사용자입니다."),
    DUPLICATE_REQUEST_ERROR(DomainCode.NORMAL, ExceptionCode.TOO_MANY_REQUEST, "해당 자원은 이미 사용중입니다."),
    CHATROOM_NOT_FOUND(DomainCode.CHATROOM, ExceptionCode.NOT_FOUND, "채팅방을 찾을 수 없습니다."),
    INVALIDATED_USER_ERROR(DomainCode.USER, ExceptionCode.INVALID, "인증된 사용자만 이용할 수 있습니다."),
    PORTFOLIO_NOT_FOUND(DomainCode.PORTFOLIO, ExceptionCode.NOT_FOUND, "포트폴리오를 찾을 수 없습니다."),
    PORTFOLIO_INVALID_ACCESS_ERROR(DomainCode.PORTFOLIO, ExceptionCode.INVALID, "비정상적인 포트폴리오 접근입니다."),
    CHANGE_ROLE_REJECTED(DomainCode.TEAM, ExceptionCode.FORBIDDEN, "권한 변경이 거부되었습니다. - 권한 없음"),
    INVITE_MEMBER_REJECTED(DomainCode.TEAM, ExceptionCode.FORBIDDEN, "초대를 할 수 없습니다. - 권한 없음");

    private final DomainCode domainCode;
    private final ExceptionCode exceptionCode;
    private final String defaultMessage;

    //10001
    public int status() {
        return domainCode.getValue() * 10000 + exceptionCode.getValue();
    }


}
