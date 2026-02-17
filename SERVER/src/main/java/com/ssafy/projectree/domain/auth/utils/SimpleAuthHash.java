package com.ssafy.projectree.domain.auth.utils;

import com.ssafy.projectree.domain.auth.jwt.Jwt;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class SimpleAuthHash implements AuthHash{

	private static final ConcurrentHashMap<String, Jwt> authHash = new ConcurrentHashMap<>();

	@Override
	public void put(String key, Jwt value) {
		authHash.put(key, value);
	}

	@Override
	public Jwt take(String key) {
		return authHash.remove(key);
	}
}
