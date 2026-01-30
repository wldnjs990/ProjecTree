package com.ssafy.projectree.global.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@OpenAPIDefinition(
        info = @Info(title = "ProjecTree WAS", description = "ProjecTree API 명세입니다.", version = "v1")
)
@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi openApi() {
        String[] paths = {"/**"};

        return GroupedOpenApi.builder()
                .group("ProjecTree API v1")
                .pathsToMatch(paths)
                .addOpenApiCustomizer(openApi -> openApi.servers(List.of(
                        new Server().url("https://i14d107.p.ssafy.io/api").description("Production"),
                        new Server().url("http://localhost:8080/api").description("Local")
                )))
                .build();
    }

}
