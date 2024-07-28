package com.nctcompany.nct03.mapper;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.artist.ArtistDetails;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.model.Artist;

public class ArtistMapper {

    public static ArtistResponse mapToResponse(Artist artist){
        ArtistResponse artistResponse = ArtistResponse.builder()
                .id(artist.getId())
                .name(artist.getName())
                .build();

        String photo = ApplicationConstants.APP_URL + "/artists/images/" + artist.getPhoto();
        artistResponse.setPhoto(photo);

        return artistResponse;
    }

    public static ArtistDetails mapToDetails(Artist artist){
        ArtistResponse artistResponse = mapToResponse(artist);
        return new ArtistDetails(artistResponse, artist.getAbout());
    }
}
