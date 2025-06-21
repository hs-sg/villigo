package com.splusz.villigo.config;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class EnvChecker {
    @PostConstruct
    public void printEnv() {
        System.out.println("==== ENV CHECK ====");
        System.out.println("SUPABASE_URL = " + System.getenv("SUPABASE_URL"));
        System.out.println("SUPABASE_USERNAME = " + System.getenv("SUPABASE_USERNAME"));
        System.out.println("SUPABASE_PASSWORD = " + System.getenv("SUPABASE_PASSWORD"));
        System.out.println("===================");
    }
}



