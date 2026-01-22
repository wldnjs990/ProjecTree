package com.ssafy.projectree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ProjectreeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectreeApplication.class, args);
    }

}
