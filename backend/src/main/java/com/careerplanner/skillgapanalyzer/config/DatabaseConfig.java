package com.careerplanner.skillgapanalyzer.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Bean
    public DataSource dataSource() {
        createDatabaseIfNotExist();

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(dbUrl);
        hikariConfig.setUsername(username);
        hikariConfig.setPassword(password);
        hikariConfig.setDriverClassName(driverClassName);

        return new HikariDataSource(hikariConfig);
    }

    private void createDatabaseIfNotExist() {
        logger.info("Checking if database needs to be created dynamically...");
        
        if (dbUrl == null || !dbUrl.startsWith("jdbc:mysql://")) {
            logger.warn("JDBC URL is not a standard MySQL URL. Skipping automatic database creation step.");
            return;
        }

        try {
            // Load driver class explicitly
            Class.forName(driverClassName);
            
            // Extract the host/port part and the database name
            // dbUrl looks like: jdbc:mysql://localhost:3306/career_planner?useSSL=false
            int startIdx = "jdbc:mysql://".length();
            int slashIdx = dbUrl.indexOf("/", startIdx);
            
            if (slashIdx != -1) {
                String serverUrl = dbUrl.substring(0, slashIdx); // e.g. jdbc:mysql://localhost:3306
                
                int questionIdx = dbUrl.indexOf("?", slashIdx);
                String dbName;
                String queryParams = "";
                
                if (questionIdx != -1) {
                    dbName = dbUrl.substring(slashIdx + 1, questionIdx);
                    queryParams = dbUrl.substring(questionIdx); // e.g. ?useSSL=false
                } else {
                    dbName = dbUrl.substring(slashIdx + 1);
                }

                // Connect to server without database selection, appending standard parameters
                String bootstrapUrl = serverUrl + "/" + queryParams;
                logger.info("Connecting to server bootstrap URL: {}", bootstrapUrl);

                try (Connection conn = DriverManager.getConnection(bootstrapUrl, username, password);
                     Statement stmt = conn.createStatement()) {
                    
                    logger.info("Running query: CREATE DATABASE IF NOT EXISTS `{}`", dbName);
                    stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS `" + dbName + "`");
                    logger.info("Database `{}` verified/created successfully.", dbName);
                    
                } catch (SQLException e) {
                    logger.error("SQL Connection Error during database check: {}", e.getMessage());
                }
            } else {
                logger.warn("Could not parse database name from URL: {}", dbUrl);
            }
        } catch (ClassNotFoundException e) {
            logger.error("Database driver class not found: {}", driverClassName);
        }
    }
}
