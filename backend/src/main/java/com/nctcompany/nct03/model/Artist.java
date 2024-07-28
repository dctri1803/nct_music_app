package com.nctcompany.nct03.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artists")
@Getter
@Setter
public class Artist extends Person{

    @Column(length = 1024)
    private String about;

    @ManyToMany(mappedBy = "artists")
    private List<Song> songs = new ArrayList<>();
}
