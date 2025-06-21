package com.splusz.villigo.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.splusz.villigo.domain.Product;
import com.splusz.villigo.domain.RentalImage;
import com.splusz.villigo.dto.RentalImageCreateDto;
import com.splusz.villigo.repository.ProductRepository;
import com.splusz.villigo.repository.RentalImageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RentalImageService {

    private final RentalImageRepository rentalImgRepo;
    private final ProductRepository prodRepo;
    private final S3TransferService s3TransferService;

    public Integer create(Long productId, RentalImageCreateDto dto) throws IOException {
        for(MultipartFile image : dto.getImages())
            {
                if (image.isEmpty()) {
                    log.info("빈 파일 건너뜁니다.");
                    continue;
                }
                
                if (image.getSize() > 10 * 1024 * 1024) {
                    throw new IllegalArgumentException("파일 용량이 너무 큽니다.");
                }

        		String savedFileUrl = s3TransferService.uploadFile(image, "villigo-post-files");
        		log.debug("파일 저장 완료: {}", savedFileUrl);

                Product product = prodRepo.findById(productId).orElseThrow();
                
                RentalImage entity = RentalImage.builder()
                    .product(product)
                    .filePath(savedFileUrl)
                    .build();

                rentalImgRepo.save(entity);
            }
        return 0;
    }

    public List<RentalImage> readByProductId(Long productId) {
        List<RentalImage> rentalImages = rentalImgRepo.findByProductId(productId);
        return rentalImages;
    }

    @Transactional
    public void deleteBeforeUpdate(List<Long> imageIdsForDelete) {

        List<RentalImage> images = rentalImgRepo.findAllById(imageIdsForDelete);
        
        for(RentalImage image : images) {
        	log.info("image = {}", image.toString());
        }

        for (RentalImage image : images) {
        	String deletedImage = image.getFilePath();
        	s3TransferService.deleteFile(deletedImage);
        	log.debug("파일 삭제 완료: [삭제된 파일] {}", deletedImage);
        }
        
        rentalImgRepo.deleteAllByIdInBatch(imageIdsForDelete);
    }
    
    @Transactional
    public void deleteByProductId(Long productId) {
    	
    	List<Long> imageIds = rentalImgRepo.findIdByProductId(productId);
    	List<RentalImage> images = rentalImgRepo.findAllById(imageIds);
    	
    	for (RentalImage image : images) {
        	String deletedImage = image.getFilePath();
        	s3TransferService.deleteFile(deletedImage);
        	log.debug("파일 삭제 완료: [삭제된 파일] {}", deletedImage);
    	}
    	
        rentalImgRepo.deleteAllByIdInBatch(imageIds);
    }


}
