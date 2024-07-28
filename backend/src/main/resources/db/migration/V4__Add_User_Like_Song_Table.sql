CREATE TABLE IF NOT EXISTS user_likes_song (
    user_id BIGINT NOT NULL,
    song_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, song_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
);

INSERT INTO user_likes_song (user_id, song_id)
VALUES
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 17),
(2, 18),
(3, 10),
(3, 11),
(3, 12),
(3, 17),
(3, 18),
(4, 10),
(4, 11),
(4, 18);