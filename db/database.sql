USE sql12756717;
CREATE TABLE login_credentials (
                                   user_id INT AUTO_INCREMENT PRIMARY KEY,
                                   username VARCHAR(50) NOT NULL UNIQUE,
                                   email VARCHAR(100) NOT NULL UNIQUE,
                                   password_hash VARCHAR(255) NOT NULL,
                                   date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
