package com.nctcompany.nct03.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "songs")
@Getter
@Setter
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 128, nullable = false)
    private String name;

    @Column(length = 255)
    private String imageName;

    @Column(length = 255)
    private String fileName;

    private LocalDate releasedOn;

    @ManyToOne
    @JoinColumn(name="genre_id", referencedColumnName = "id")
    private Genre genre;

    @ManyToMany(
            fetch = FetchType.EAGER
    )
    @JoinTable(
            name = "artist_songs",
            joinColumns = @JoinColumn(name = "song_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "artist_id", referencedColumnName = "id")
    )
    private List<Artist> artists = new ArrayList<>();

    @ManyToMany(
            fetch = FetchType.EAGER,
            mappedBy = "likedSongs"
    )
    private List<User> likedByUsers = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Song song = (Song) o;

        return Objects.equals(id, song.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
