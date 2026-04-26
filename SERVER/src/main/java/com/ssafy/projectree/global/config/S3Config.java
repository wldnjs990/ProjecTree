package com.ssafy.projectree.global.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    @Value("${spring.cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${spring.cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${spring.cloud.aws.s3.region}")
    private String region;

    @Value("${spring.cloud.aws.endpoint:}")
    private String endpoint;

    @Bean
    public AmazonS3 s3Builder() {
        AWSCredentials basicAwsCredentials = new BasicAWSCredentials(accessKey, secretKey);

        AmazonS3ClientBuilder builder = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(basicAwsCredentials));

        if (endpoint != null && !endpoint.isBlank()) {
            builder.withEndpointConfiguration(
                    new AwsClientBuilder.EndpointConfiguration(endpoint, region));
            builder.withPathStyleAccessEnabled(true);
        } else {
            builder.withRegion(region);
        }

        return builder.build();
    }
}
