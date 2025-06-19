package com.splusz.villigo.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class EnvChecker implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) {
        System.out.println("△△△ SUPABASE_URL: " + System.getenv("SUPABASE_URL"));
        System.out.println("△△△ SUPABASE_USERNAME: " + System.getenv("SUPABASE_USERNAME"));
        System.out.println("△△△ SUPABASE_PW: " + System.getenv("SUPABASE_PW"));
    }
}

