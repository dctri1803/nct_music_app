package com.nctcompany.nct03.repository;

import com.nctcompany.nct03.model.Song;
import com.nctcompany.nct03.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u.likedSongs FROM User u WHERE u.id = :userId")
    List<Song> findLikedSongsByUserId(@Param("userId") Long userId);

    @Modifying
    @Query(value = "INSERT INTO user_likes_song (user_id, song_id) VALUES (:userId, :songId)", nativeQuery = true)
    @Transactional
    void likeSong(@Param("userId") Long userId, @Param("songId") Long songId);

    @Modifying
    @Query(value = "DELETE FROM user_likes_song WHERE user_id = :userId AND song_id = :songId", nativeQuery = true)
    @Transactional
    void unlikeSong(@Param("userId") Long userId, @Param("songId") Long songId);
}
