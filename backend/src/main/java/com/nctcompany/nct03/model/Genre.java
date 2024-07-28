package com.nctcompany.nct03.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "genres")
@Getter
@Setter
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 64, nullable = false, unique = true)
    private String name;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "genre"
    )
    private List<Song> songs = new ArrayList<>();
}
