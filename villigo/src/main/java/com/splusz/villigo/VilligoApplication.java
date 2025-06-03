package com.splusz.villigo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import jakarta.annotation.PostConstruct;

@EnableJpaAuditing
@SpringBootApplication
public class VilligoApplication {

	public static void main(String[] args) {
		SpringApplication.run(VilligoApplication.class, args);
	}
	
	@PostConstruct
	public void printJvmInfo() {
		long maxMem = Runtime.getRuntime().maxMemory() / (1024*1024);
		long totalMem = Runtime.getRuntime().totalMemory() / (1024*1024);
	    System.out.println("🧠 JVM Max Memory: " + maxMem + " MB");
	    System.out.println("💾 JVM Total Memory: " + totalMem + " MB");
	}
}
