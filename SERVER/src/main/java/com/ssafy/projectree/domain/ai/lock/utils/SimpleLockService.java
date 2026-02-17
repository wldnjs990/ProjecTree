package com.ssafy.projectree.domain.ai.lock.utils;

import com.ssafy.projectree.domain.ai.lock.LockType;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.AIServiceException;
import org.springframework.stereotype.Component;

import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Supplier;
import java.util.logging.Handler;

@Component
public class SimpleLockService implements LockService {
    private final ConcurrentHashMap<String, ReentrantLock> locks = new ConcurrentHashMap<>();

    @Override
    public void execute(LockType type, String key, Runnable task) {
        execute(type, key, () -> {
            task.run();
            return null;
        });
    }

    @Override
    public <T> T execute(LockType type, String key, Callable<T> task) {
        String lockKey = makeKey(type, key);

        // 해당 키에 대한 락이 없으면 생성, 있으면 반환 (원자적 연산)
        ReentrantLock lock = locks.computeIfAbsent(lockKey, k -> new ReentrantLock());
        if (lock.tryLock()) {
            try {
                // 락 획득 성공 -> 로직 실행
                return task.call();
            } catch (Exception e) {
                // 실행 중 에러 발생 시 처리
                if (e instanceof RuntimeException) {
                    throw (RuntimeException) e;
                }
                throw new RuntimeException(e);
            } finally {
                // 작업 끝나면 무조건 해제
                lock.unlock();
            }
        } else {
            throw new AIServiceException(
                    ErrorCode.DUPLICATE_REQUEST_ERROR, // "이미 요청이 처리 중입니다" 같은 에러 코드 필요
                    "이미 해당 자원에 대한 작업이 진행 중입니다."
            );
        }
    }

    private String makeKey(LockType type, String key) {
        return type + ":" + key; // 예: "IMAGE:1023", "VOICE:551"
    }
}
