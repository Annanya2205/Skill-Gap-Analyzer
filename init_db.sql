USE career_planner;

-- 1. Drop tables in correct order if they exist
DROP TABLE IF EXISTS learning_roadmaps;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS required_skills;
DROP TABLE IF EXISTS skill_resources;
DROP TABLE IF EXISTS career_roles;
DROP TABLE IF EXISTS skills;

-- 2. Create tables
CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE career_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL
);

CREATE TABLE required_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    importance VARCHAR(50) DEFAULT 'Core',
    suggested_month INT DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES career_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE skill_resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_id BIGINT NOT NULL,
    resource_name VARCHAR(200) NOT NULL,
    resource_url VARCHAR(500) NOT NULL,
    type VARCHAR(100) NOT NULL,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    education VARCHAR(200) NOT NULL,
    college VARCHAR(200) NOT NULL,
    graduation_year INT NOT NULL,
    dream_role_id BIGINT,
    xp INT DEFAULT 0,
    streak INT DEFAULT 0,
    FOREIGN KEY (dream_role_id) REFERENCES career_roles(id) ON DELETE SET NULL
);

CREATE TABLE user_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill (user_id, skill_id)
);

CREATE TABLE learning_roadmaps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    milestone VARCHAR(255) NOT NULL,
    target_month INT NOT NULL,
    skills_covered VARCHAR(255) NOT NULL, -- Comma-separated list of skill names/IDs
    completed BOOLEAN DEFAULT FALSE,
    target_date DATE NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Seed Skills Catalog
INSERT INTO skills (id, skill_name, category) VALUES
(1, 'Java', 'Backend'),
(2, 'Data Structures and Algorithms', 'Programming'),
(3, 'Object-Oriented Programming', 'Programming'),
(4, 'DBMS', 'Database'),
(5, 'SQL', 'Database'),
(6, 'Computer Networks', 'Programming'),
(7, 'Operating Systems', 'Programming'),
(8, 'Git and GitHub', 'DevOps'),
(9, 'Problem Solving', 'Programming'),
(10, 'HTML', 'Frontend'),
(11, 'CSS', 'Frontend'),
(12, 'JavaScript', 'Frontend'),
(13, 'TypeScript', 'Frontend'),
(14, 'React', 'Frontend'),
(15, 'Spring Boot', 'Backend'),
(16, 'System Design', 'Backend'),
(17, 'Docker', 'DevOps'),
(18, 'Kubernetes', 'DevOps'),
(19, 'Cloud Computing (AWS/Azure)', 'DevOps'),
(20, 'Node.js & Express', 'Backend'),
(21, 'MongoDB', 'Database'),
(22, 'Python', 'Programming'),
(23, 'Machine Learning', 'Programming'),
(24, 'Deep Learning', 'Programming'),
(25, 'Statistics', 'Programming'),
(26, 'Tableau & Power BI', 'Database'),
(27, 'Excel', 'Database'),
(28, 'Linux', 'DevOps');

-- 4. Seed Career Roles
INSERT INTO career_roles (id, role_name, description) VALUES
(1, 'Software Engineer', 'Designs, develops, and maintains software applications and systems. Requires solid DSA, programming fundamentals, and system design.'),
(2, 'Frontend Developer', 'Specializes in building user-facing parts of web applications. Focuses on UI/UX, React, JavaScript, HTML, and CSS.'),
(3, 'Backend Developer', 'Specializes in application logic, API integration, databases, and server-side components. Requires knowledge of Java/Spring, Node, SQL/NoSQL databases.'),
(4, 'Full Stack Developer', 'Covers both frontend and backend development. Requires a wide range of frontend and backend technologies.'),
(5, 'Data Analyst', 'Processes, cleans, and analyzes data to help businesses make decisions. Requires SQL, statistics, Tableau/PowerBI, and Excel.'),
(6, 'Data Scientist', 'Uses statistical methods, machine learning models, and scripting (Python) to extract insights and solve complex business problems.'),
(7, 'DevOps Engineer', 'Bridges development and operations. Focuses on CI/CD pipelines, containerization (Docker, K8s), cloud infrastructure, and automation.');

-- 5. Seed Required Skills Mapping
-- Software Engineer (Role 1)
INSERT INTO required_skills (role_id, skill_id, importance, suggested_month) VALUES
(1, 1, 'Core', 1),    -- Java
(1, 3, 'Core', 1),    -- OOP
(1, 2, 'Core', 2),    -- DSA
(1, 9, 'Core', 3),    -- Problem Solving
(1, 5, 'Core', 4),    -- SQL
(1, 4, 'Core', 4),    -- DBMS
(1, 6, 'Optional', 5),-- Computer Networks
(1, 7, 'Optional', 5),-- Operating Systems
(1, 8, 'Core', 6);    -- Git & GitHub

-- Frontend Developer (Role 2)
INSERT INTO required_skills (role_id, skill_id, importance, suggested_month) VALUES
(2, 10, 'Core', 1),   -- HTML
(2, 11, 'Core', 1),   -- CSS
(2, 12, 'Core', 2),   -- JavaScript
(2, 8, 'Core', 3),    -- Git & GitHub
(2, 13, 'Optional', 4),-- TypeScript
(2, 14, 'Core', 5),   -- React
(2, 9, 'Optional', 6);-- Problem Solving

-- Backend Developer (Role 3)
INSERT INTO required_skills (role_id, skill_id, importance, suggested_month) VALUES
(3, 1, 'Core', 1),    -- Java
(3, 3, 'Core', 1),    -- OOP
(3, 5, 'Core', 2),    -- SQL
(3, 4, 'Core', 2),    -- DBMS
(3, 15, 'Core', 3),   -- Spring Boot
(3, 20, 'Optional', 4),-- Node.js & Express
(3, 21, 'Optional', 4),-- MongoDB
(3, 8, 'Core', 5),    -- Git & GitHub
(3, 16, 'Core', 6);   -- System Design

-- Full Stack Developer (Role 4)
INSERT INTO required_skills (role_id, skill_id, importance, suggested_month) VALUES
(4, 10, 'Core', 1),   -- HTML
(4, 11, 'Core', 1),   -- CSS
(4, 12, 'Core', 2),   -- JavaScript
(4, 14, 'Core', 3),   -- React
(4, 1, 'Core', 4),    -- Java
(4, 15, 'Core', 5),   -- Spring Boot
(4, 5, 'Core', 5),    -- SQL
(4, 8, 'Core', 6);    -- Git & GitHub

-- Data Analyst (Role 5)
INSERT INTO required_skills (role_id, skill_id, importance, suggested_month) VALUES
(5, 27, 'Core', 1),   -- Excel
(5, 5, 'Core', 2),    -- SQL
(5, 25, 'Core', 3),   -- Statistics
(5, 22, 'Optional', 4),-- Python
(5, 26, 'Core', 5),   -- Tableau & Power BI
(5, 8, 'Optional', 6);-- Git & GitHub

-- Data Scientist (Role 6)
INSERT INTO required_skills (role_id, skill_id, importance, suggested_month) VALUES
(6, 22, 'Core', 1),   -- Python
(6, 25, 'Core', 2),   -- Statistics
(6, 5, 'Core', 3),    -- SQL
(6, 23, 'Core', 4),   -- Machine Learning
(6, 24, 'Optional', 5),-- Deep Learning
(6, 8, 'Optional', 6);-- Git & GitHub

-- DevOps Engineer (Role 7)
INSERT INTO required_skills (role_id, skill_id, importance, suggested_month) VALUES
(7, 28, 'Core', 1),   -- Linux
(7, 8, 'Core', 2),    -- Git & GitHub
(7, 17, 'Core', 3),   -- Docker
(7, 19, 'Core', 4),   -- Cloud Computing
(7, 18, 'Core', 5),   -- Kubernetes
(7, 16, 'Optional', 6);-- System Design

-- 6. Seed Learning Resources
-- Java
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(1, 'GeeksforGeeks Java Tutorials', 'https://www.geeksforgeeks.org/java/', 'Tutorial'),
(1, 'Oracle Java Documentation', 'https://docs.oracle.com/en/java/', 'Documentation'),
(1, 'Java Programming Masterclass (Java 21) - Udemy', 'https://www.udemy.com/course/java-the-complete-java-developer-course/', 'Course');

-- DSA
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(2, 'LeetCode Coding Practice', 'https://leetcode.com/', 'Practice Platform'),
(2, 'NeetCode DSA Roadmap', 'https://neetcode.io/', 'Tutorial'),
(2, 'GeeksforGeeks DSA Guide', 'https://www.geeksforgeeks.org/data-structures/', 'Tutorial');

-- OOP
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(3, 'Java OOP Concepts - W3Schools', 'https://www.w3schools.com/java/java_oop.asp', 'Tutorial'),
(3, 'Object-Oriented Programming (OOP) in Java - GfG', 'https://www.geeksforgeeks.org/object-oriented-programming-in-java/', 'Tutorial');

-- DBMS
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(4, 'DBMS Tutorial - TutorialsPoint', 'https://www.tutorialspoint.com/dbms/index.htm', 'Tutorial'),
(4, 'Database Management System course - NPTEL', 'https://nptel.ac.in/courses/106105175', 'Course');

-- SQL
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(5, 'SQL Tutorial - W3Schools', 'https://www.w3schools.com/sql/', 'Tutorial'),
(5, 'SQL Exercises on LeetCode (SQL 50)', 'https://leetcode.com/studyplan/30-days-of-sql/', 'Practice Platform');

-- Computer Networks
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(6, 'Computer Networks Tutorial - GeeksforGeeks', 'https://www.geeksforgeeks.org/computer-network-tutorials/', 'Tutorial');

-- Operating Systems
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(7, 'Operating System Tutorial - GeeksforGeeks', 'https://www.geeksforgeeks.org/operating-systems/', 'Tutorial');

-- Git & GitHub
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(8, 'Git Docs & Book', 'https://git-scm.com/doc', 'Documentation'),
(8, 'GitHub Skills Interactive Tutorials', 'https://skills.github.com/', 'Practice Platform');

-- Problem Solving
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(9, 'HackerRank Problem Solving Prep', 'https://www.hackerrank.com/domains/algorithms', 'Practice Platform');

-- HTML
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(10, 'MDN Web Docs - HTML', 'https://developer.mozilla.org/en-US/docs/Web/HTML', 'Documentation');

-- CSS
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(11, 'MDN Web Docs - CSS', 'https://developer.mozilla.org/en-US/docs/Web/CSS', 'Documentation');

-- JavaScript
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(12, 'MDN Web Docs - JavaScript Guide', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'Documentation'),
(12, 'The Modern JavaScript Tutorial', 'https://javascript.info/', 'Tutorial');

-- TypeScript
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(13, 'TypeScript HandBook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'Documentation');

-- React
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(14, 'React Official Docs & Quickstart', 'https://react.dev/', 'Documentation');

-- Spring Boot
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(15, 'Spring Boot Guide - Baeldung', 'https://www.baeldung.com/spring-boot', 'Tutorial'),
(15, 'Building REST APIs - Spring.io', 'https://spring.io/guides/gs/rest-service/', 'Documentation');

-- System Design
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(16, 'System Design Primer on GitHub', 'https://github.com/donnemartin/system-design-primer', 'Documentation'),
(16, 'ByteByteGo System Design', 'https://bytebytego.com/', 'Tutorial');

-- Docker
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(17, 'Docker Getting Started Guide', 'https://docs.docker.com/get-started/', 'Documentation');

-- Kubernetes
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(18, 'Kubernetes Basics & Tutorials', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', 'Documentation');

-- Cloud
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(19, 'AWS Skill Builder', 'https://skillbuilder.aws/', 'Course'),
(19, 'Microsoft Learn Azure Modules', 'https://learn.microsoft.com/en-us/azure/', 'Documentation');

-- Node.js
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(20, 'Node.js Documentation', 'https://nodejs.org/en/docs/', 'Documentation');

-- MongoDB
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(21, 'MongoDB University Courses', 'https://university.mongodb.com/', 'Course');

-- Python
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(22, 'Python Official Tutorial', 'https://docs.python.org/3/tutorial/', 'Documentation');

-- Machine Learning
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(23, 'Machine Learning course - Coursera (Andrew Ng)', 'https://www.coursera.org/specializations/machine-learning-introduction', 'Course');

-- Deep Learning
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(24, 'Deep Learning Specialization - deeplearning.ai', 'https://www.deeplearning.ai/courses/deep-learning-specialization/', 'Course');

-- Statistics
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(25, 'Khan Academy Probability & Statistics', 'https://www.khanacademy.org/math/statistics-probability', 'Tutorial');

-- Tableau / Power BI
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(26, 'Tableau Training Videos', 'https://www.tableau.com/learn/training', 'Tutorial'),
(26, 'Microsoft Power BI Learn Path', 'https://learn.microsoft.com/en-us/power-bi/', 'Documentation');

-- Excel
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(27, 'Excel for Windows Training', 'https://support.microsoft.com/en-us/office/excel-for-windows-training-9bc05390-e94c-46af-a5b3-d7c22f6990bb', 'Tutorial');

-- Linux
INSERT INTO skill_resources (skill_id, resource_name, resource_url, type) VALUES
(28, 'Linux Journey Tutorials', 'https://linuxjourney.com/', 'Tutorial');
