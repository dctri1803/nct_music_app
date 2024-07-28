ALTER TABLE token
    ADD COLUMN refresh_token VARCHAR(255) NOT NULL,
    ADD COLUMN refresh_expired_date DATETIME;