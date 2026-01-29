package com.ssafy.projectree.domain.file.usecase;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3Client;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * S3 File Upload 함수
     *
     * @param file
     * @param workspaceId
     * @param savedFileName
     * @return
     * @throws IOException
     */
    public String uploadFile(MultipartFile file, Long workspaceId, String savedFileName) throws IOException {

        String path = "workspace/" + workspaceId + "/" + savedFileName;
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        InputStream inputStream = file.getInputStream();
        amazonS3Client.putObject(new PutObjectRequest(bucket, path, inputStream, metadata));

        return amazonS3Client.getUrl(bucket, path).toString();
    }

}
