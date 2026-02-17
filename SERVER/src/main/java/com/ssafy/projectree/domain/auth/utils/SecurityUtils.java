package com.ssafy.projectree.domain.auth.utils;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public static Member getCurrentMember(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() instanceof String) {
            throw new BusinessLogicException(ErrorCode.INVALIDATED_USER_ERROR, "인증된 사용자만 이용할 수 있습니다.");
        }
        return (Member) authentication.getPrincipal();
    }
}
