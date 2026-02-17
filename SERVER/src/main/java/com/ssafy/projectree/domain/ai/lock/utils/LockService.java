package com.ssafy.projectree.domain.ai.lock.utils;

import com.ssafy.projectree.domain.ai.lock.LockType;

import java.util.concurrent.Callable;
import java.util.concurrent.locks.Lock;
import java.util.function.Supplier;

public interface LockService {
    void execute(LockType type, String key, Runnable task);

    <T> T execute(LockType type, String key, Callable<T> task);

}
