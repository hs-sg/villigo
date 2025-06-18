package com.splusz.villigo.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DataSourceChecker {

    @Value("${spring.datasource.url:NOT_SET}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:NOT_SET}")
    private String datasourceUsername;

    @Value("${spring.datasource.password:NOT_SET}")
    private String datasourcePassword;

    @PostConstruct
    public void logDataSourceInfo() {
        System.out.println("✅ [CHECK] spring.datasource.url: " + datasourceUrl);
        System.out.println("✅ [CHECK] spring.datasource.username: " + datasourceUsername);
        System.out.println("✅ [CHECK] spring.datasource.password is set: " + (datasourcePassword != null && !datasourcePassword.equals("NOT_SET")));
    }
}
