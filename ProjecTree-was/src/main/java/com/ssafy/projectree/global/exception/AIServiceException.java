package com.ssafy.projectree.global.exception;

import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.cache.CacheType;
import lombok.Getter;

@Getter
public class AIServiceException extends CustomException {
	private Long key;

	private CacheType cacheType;

	public AIServiceException(ErrorCode errorCode, Long key, CacheType cacheType) {
		super(errorCode);
		this.key = key;
		this.cacheType = cacheType;
	}

	public AIServiceException(ErrorCode errorCode, String message) {
		super(errorCode, message);
	}


	public AIServiceException(ErrorCode errorCode, Throwable cause, Long key) {
		super(errorCode, cause);
	}
}
