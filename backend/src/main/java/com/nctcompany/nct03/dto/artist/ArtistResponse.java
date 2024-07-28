package com.nctcompany.nct03.dto.artist;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ArtistResponse {

    private Long id;
    private String name;
    private String photo;
}
