package com.ssafy.projectree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableRetry // 이 어노테이션 필수
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync // 이 어노테이션이 꼭 필요합니다!
public class ProjectreeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectreeApplication.class, args);
    }

}
