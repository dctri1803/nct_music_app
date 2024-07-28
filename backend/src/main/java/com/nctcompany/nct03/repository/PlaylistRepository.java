package com.nctcompany.nct03.repository;

import com.nctcompany.nct03.model.Playlist;
import com.nctcompany.nct03.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    boolean existsByNameAndUser(String name, User user);
    Optional<Playlist> findByIdAndUserId(Long id, Long userId);
    Page<Playlist> findByUserIdOrderByIdDesc(Long userId, Pageable pageable);
    @Query("SELECT COUNT(p) > 0 FROM Playlist p JOIN p.songs s WHERE p.id = :playlistId AND s.id = :songId")
    Boolean isSongInPlaylist(@Param("playlistId") Long playlistId, @Param("songId") Long songId);
}
