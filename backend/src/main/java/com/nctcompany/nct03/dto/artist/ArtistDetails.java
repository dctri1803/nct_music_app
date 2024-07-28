package com.nctcompany.nct03.dto.artist;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtistDetails extends ArtistResponse{

    private String about;

    public ArtistDetails(Long id, String name, String photo, String about) {
        super(id, name, photo);
        this.about = about;
    }

    public ArtistDetails(ArtistResponse artistResponse, String about) {
        super(artistResponse.getId(), artistResponse.getName(), artistResponse.getPhoto());
        this.about = about;
    }
}
