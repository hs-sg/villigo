package com.splusz.villigo.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

import com.splusz.villigo.domain.Address;
import com.splusz.villigo.domain.Brand;
import com.splusz.villigo.domain.Car;
import com.splusz.villigo.domain.Product;
import com.splusz.villigo.domain.RentalImage;
import com.splusz.villigo.domain.Reservation;
import com.splusz.villigo.domain.User;
import com.splusz.villigo.dto.AddressCreateDto;
import com.splusz.villigo.dto.AddressUpdateDto;
import com.splusz.villigo.dto.CarCreateDto;
import com.splusz.villigo.dto.CarUpdateDto;
import com.splusz.villigo.dto.RentalImageCreateDto;
import com.splusz.villigo.service.AddressService;
import com.splusz.villigo.service.CarService;
import com.splusz.villigo.service.ProductService;
import com.splusz.villigo.service.RentalImageService;
import com.splusz.villigo.service.ReservationService;
import com.splusz.villigo.service.S3TransferService;
import com.splusz.villigo.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/post")
public class CarController {

    private final ProductService prodServ;
    private final RentalImageService rentalImgServ;
    private final CarService carServ;
    private final AddressService addServ;
    private final UserService userServ;
    private final ReservationService reservServ;
    private final Long rentalCategoryNumber = 1L;

    @GetMapping("/create/car")
    public void create(Model model) {
        log.info("bag create()");
        model.addAttribute("brands", prodServ.readBrands(rentalCategoryNumber));
        model.addAttribute("colors", prodServ.readColors(rentalCategoryNumber));
    }

    @PostMapping(path = "/create/car", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String create(@ModelAttribute CarCreateDto carDto, 
        @ModelAttribute RentalImageCreateDto imgDto, 
        @ModelAttribute AddressCreateDto addDto) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof User) { // principal이 User 객체인지 확인
                User user = (User) principal; // 캐스팅
                String username = user.getUsername(); // User 객체의 id 반환

                log.info("bagDto={}", carDto);
                log.info("imgDto={}", imgDto);
                log.info("addDto={}", addDto);

                if(carDto.getBrandId() == 0) {
                    Brand brand = prodServ.createBrand(rentalCategoryNumber, carDto.getCustomBrand());
                    carDto.setBrandId(brand.getId());
                }

                Product product = carServ.create(carDto, username, rentalCategoryNumber);
                
                if(imgDto.getImages() != null && !imgDto.getImages().isEmpty()) {
                    rentalImgServ.create(product.getId(), imgDto);
                } else {
                    log.info("이미지 첨부 X");
                }
        
                addServ.create(product, addDto);
                return "redirect:/post/details/car?id=" + product.getId();
            } 
        }
        return "redirect:/";
    }

    @GetMapping("/details/car")
    public void detail(@RequestParam(name="id") Long productId, Model model) {

        log.info("datail car(productId={})", productId);
        Product product = prodServ.readById(productId);
        log.info("product={}", product);
        User user = userServ.read(product.getUser().getId());
        log.info("user={}", user);
        Car car = carServ.readByProductId(productId);
        log.info("car={}", car);
        Address address = addServ.readByProductId(productId);
        log.info("address={}", address);
        List<RentalImage> rentalImages = rentalImgServ.readByProductId(productId);
        log.info("rentalImages={}", rentalImages);

        model.addAttribute("product", product);
        model.addAttribute("user", user);
        model.addAttribute("car", car);
        model.addAttribute("address", address);
        model.addAttribute("rentalImages", rentalImages);
    }

    @DeleteMapping("/delete/car")
    public ResponseEntity<String> delete(@RequestParam(name="id") Long productId) {
    	
    	List<Reservation> reservations = reservServ.readAll(productId);
    	log.info("reservations={}", reservations);
    	if(!reservations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("해당 제품에 있는 예약을 처리 후 삭제가 가능합니다.");
    	} else {
            log.info("bag delete(productId={})", productId);
            rentalImgServ.deleteByProductId(productId);
            prodServ.deleteById(productId);
        	return ResponseEntity.ok("삭제 완료");
    	}
    }
    
    @GetMapping("/modify/car")
    public void modify(@RequestParam(name="id") Long productId, Model model) {
        log.info("car modify(productId={})", productId);
        Product product = prodServ.readById(productId);
        Car car = carServ.readByProductId(productId);
        Address address = addServ.readByProductId(productId);
        List<RentalImage> rentalImages = rentalImgServ.readByProductId(productId);

        model.addAttribute("product", product);
        model.addAttribute("car", car);
        model.addAttribute("address", address);
        model.addAttribute("rentalImages", rentalImages);
    }

    @PostMapping(path = "/update/car", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String update(@RequestParam(name="id") Long productId, @RequestParam(name="existingImageIds", required = false) List<Long> existingImageIds, 
        @ModelAttribute CarUpdateDto carDto, @ModelAttribute RentalImageCreateDto imgDto, @ModelAttribute AddressUpdateDto addDto) throws IOException {
        log.info("car update(productId={})", productId);
        log.info("car update(existingImageIds={})", existingImageIds);
        log.info("car update(carUpdateDto={})", carDto);
        log.info("car update(RentalImageCreateDto={})", imgDto);
        log.info("car update(AddressUpdateDto={})", addDto);
        
        List<Long> safeExistingImageIds = existingImageIds != null ? existingImageIds : new ArrayList<>();
        
        List<RentalImage> imagesBeforeUpdate = rentalImgServ.readByProductId(productId);
        List<Long> imageIdsBeforeUpdate = imagesBeforeUpdate.stream()
        	    .map(RentalImage :: getId)
        	    .collect(Collectors.toList());
        
        List<Long> imageIdsForDelete = imageIdsBeforeUpdate.stream()
                .filter(imageId -> !safeExistingImageIds.contains(imageId))
                .collect(Collectors.toList());
        
        Set<Long> imageIdsBeforeUpdateSet = new HashSet<>(imageIdsBeforeUpdate);
        Set<Long> imageIdsForDeleteSet = new HashSet<>(imageIdsForDelete);

        Product updatedProduct = carServ.update(productId, carDto);
        Address updatedAddress = addServ.update(productId, addDto);

        if(!imageIdsBeforeUpdateSet.equals(imageIdsForDeleteSet) || 
        		(imageIdsBeforeUpdateSet.equals(imageIdsForDeleteSet) && !imageIdsForDeleteSet.isEmpty())) {
        	rentalImgServ.deleteBeforeUpdate(imageIdsForDelete);
        }
        if(!imgDto.getImages().isEmpty()) {
        	rentalImgServ.create(productId, imgDto);
        }

        return "redirect:/post/details/car?id=" + productId;
    }
}
