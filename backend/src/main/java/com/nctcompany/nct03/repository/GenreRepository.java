package com.nctcompany.nct03.repository;

import com.nctcompany.nct03.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
}
