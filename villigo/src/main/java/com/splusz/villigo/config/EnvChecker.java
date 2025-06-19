package com.splusz.villigo.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvChecker {
    static {
        System.out.println("◇ [STATIC] SUPABASE_URL: " + System.getenv("SUPABASE_URL"));
        System.out.println("◇ [STATIC] SUPABASE_USERNAME: " + System.getenv("SUPABASE_USERNAME"));
        System.out.println("◇ [STATIC] SUPABASE_PW: " + System.getenv("SUPABASE_PASSWORD"));
    }
}


