package com.nctcompany.nct03.repository;

import com.nctcompany.nct03.model.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Page<Artist> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
