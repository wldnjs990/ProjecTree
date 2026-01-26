package com.ssafy.projectree.domain.ai.service;

public interface LockService<K, V> {
    void put(K key, V value);
    //TODO : 캐시 기반 요청 락기능 구현
}
