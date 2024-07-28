package com.nctcompany.nct03.repository;

import com.nctcompany.nct03.model.Artist;
import com.nctcompany.nct03.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    @Query("SELECT s FROM Song s ORDER BY s.releasedOn DESC")
    Page<Song> findLatestReleasedSongs(Pageable pageable);

    @Query("SELECT s FROM Song s ORDER BY SIZE(s.likedByUsers) DESC")
    Page<Song> findMostLikedSongs(Pageable pageable);

    Page<Song> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Song> findByArtistsContaining(Artist artist, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END FROM Song s JOIN s.likedByUsers u WHERE u.id = :userId AND s.id = :songId")
    Boolean isSongLikedByUser(@Param("userId") Long userId, @Param("songId") Long songId);
}
