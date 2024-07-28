CREATE TABLE token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    expired_date DATETIME,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);