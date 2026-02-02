package com.ssafy.projectree.global.logging;
import lombok.extern.log4j.Log4j2;
import org.springframework.retry.RetryCallback;
import org.springframework.retry.RetryContext;
import org.springframework.retry.RetryListener;
import org.springframework.stereotype.Component;

@Log4j2
@Component("retryLoggingListener") // 빈 이름을 지정해둡니다.
public class RetryLoggingListener implements RetryListener {

    @Override
    public <T, E extends Throwable> void onError(RetryContext context, RetryCallback<T, E> callback, Throwable throwable) {
        // context.getRetryCount()는 현재까지 시도한 횟수입니다. (0부터 시작)
        int currentRetryCount = context.getRetryCount() + 1;

        log.warn("### Retry occurred! [Attempt: {}] Error Type: {}, Message: {}",
                currentRetryCount,
                throwable.getClass().getSimpleName(),
                throwable.getMessage());
    }

    // open과 close는 필요 없다면 default 메서드이므로 생략하거나 비워도 됩니다.
    @Override
    public <T, E extends Throwable> boolean open(RetryContext context, RetryCallback<T, E> callback) {
        return true; // true를 반환해야 리트라이가 진행됩니다.
    }

    @Override
    public <T, E extends Throwable> void close(RetryContext context, RetryCallback<T, E> callback, Throwable throwable) {
        // 재시도 종료(성공했거나, 횟수를 다 채워서 실패했거나) 시 실행됨
    }
}
