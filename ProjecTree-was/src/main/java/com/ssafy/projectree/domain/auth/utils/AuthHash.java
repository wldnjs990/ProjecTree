package com.ssafy.projectree.domain.auth.utils;

import com.ssafy.projectree.domain.auth.jwt.Jwt;

public interface AuthHash {
	void put(String key, Jwt value);
	Jwt take(String key);
}
