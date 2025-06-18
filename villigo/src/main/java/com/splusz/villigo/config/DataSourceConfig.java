package com.splusz.villigo.config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {
	
	@Bean
	public DataSource dataSource() {
		HikariDataSource ds = new HikariDataSource();
		ds.setJdbcUrl(System.getenv("SUPABASE_URL"));
		ds.setUsername(System.getenv("SUPABASE_USERNAME"));
		ds.setPassword(System.getenv("SUPABASE_PW"));
		return ds;
	}
}
