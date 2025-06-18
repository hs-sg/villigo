package com.splusz.villigo.config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {
	
	@Bean
	public DataSource dataSource() {
        String url = System.getenv("SUPABASE_URL");
        String username = System.getenv("SUPABASE_USERNAME");
        String password = System.getenv("SUPABASE_PASSWORD"); // ✅ 여기 수정됨

        if (url == null || username == null || password == null) {
            throw new IllegalStateException("❌ 환경변수 누락: JDBC 접속 정보가 없습니다.");
        }

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(url);
        ds.setUsername(username);
        ds.setPassword(password);
        return ds;
    }
}
