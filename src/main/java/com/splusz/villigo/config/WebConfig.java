package com.splusz.villigo.config;

import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// 이미지 경로에 캐시 허용
		registry.addResourceHandler("/images/**") // URL 기준
				.addResourceLocations("classpath:/static/images/") // 실제 위치
				.setCacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic());
	}
}
