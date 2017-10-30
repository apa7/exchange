package com.dataart.configs;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@EnableTransactionManagement
@Configuration
public class DatabaseConfig {
    @Value("${db.migrations}")
    private String migrations;

    @Autowired
    @Bean(name = {"defaultPlatformFlywayConfiguration", "flyway"})
    protected Flyway defaultPlatformFlywayConfiguration(DataSource dataSource) {
        final Flyway flyway = new Flyway();
        flyway.setDataSource(dataSource);
        flyway.setLocations(migrations);
        flyway.migrate();
        return flyway;
    }
}
