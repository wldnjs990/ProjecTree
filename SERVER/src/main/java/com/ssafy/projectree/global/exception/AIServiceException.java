package com.ssafy.projectree.global.exception;

import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.domain.ai.lock.LockType;
import lombok.Getter;

@Getter
public class AIServiceException extends CustomException {
	private Long key;

	private LockType lockType;

	public AIServiceException(ErrorCode errorCode, Long key, LockType lockType, String message) {
		super(errorCode, message);
		this.key = key;
		this.lockType = lockType;
	}

	public AIServiceException(ErrorCode errorCode, String message) {
		super(errorCode, message);
	}


	public AIServiceException(ErrorCode errorCode, Throwable cause, Long key) {
		super(errorCode, cause);
	}
}
