package com.splusz.villigo.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3TransferService {
	
	private final S3Client s3Client;
    private final String bucketName = "shindev";
    
	public String uploadFile(MultipartFile file, String folder) {
        try {
            String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(
            		request,
            	    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            	);

            return "https://" + bucketName + ".s3.amazonaws.com/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("S3 파일 업로드 실패", e);
        }
    }
	
	public void deleteFile(String fileUrl) {
	    // S3 URL → Key(파일 이름) 추출
	    // 예: https://your-bucket-name.s3.amazonaws.com/festival-images/abc.jpg
		//     => 파일 이름: festival-images/abc.jpg
	    String fileKey = fileUrl.replace("https://" + bucketName + ".s3.amazonaws.com/", "");

	    DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
	            .bucket(bucketName)
	            .key(fileKey)
	            .build();

	    s3Client.deleteObject(deleteRequest);
	}
}
