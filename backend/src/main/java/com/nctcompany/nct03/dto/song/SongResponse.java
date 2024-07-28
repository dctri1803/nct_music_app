package com.nctcompany.nct03.dto.song;

import com.nctcompany.nct03.dto.artist.ArtistResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
public class SongResponse {

    private Long id;
    private String name;
    private String imagePath;
    private String url;
    private LocalDate releasedOn;
    private String genre;
    private Integer numberLikes;
    private List<ArtistResponse> artists;
}
