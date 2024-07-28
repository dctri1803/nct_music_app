package com.nctcompany.nct03.mapper;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.model.Artist;
import com.nctcompany.nct03.model.Song;

import java.util.ArrayList;
import java.util.List;

public class SongMapper {

    public static SongResponse mapToSongResponse(Song song){
        SongResponse songResponse = SongResponse.builder()
                .id(song.getId())
                .name(song.getName())
                .releasedOn(song.getReleasedOn())
                .genre(song.getGenre().getName())
                .build();
        List<ArtistResponse> artists = new ArrayList<>();
        for (Artist artist: song.getArtists()){
            artists.add(ArtistMapper.mapToResponse(artist));
        }
        songResponse.setArtists(artists);

        songResponse.setNumberLikes(song.getLikedByUsers().size());

        String url = ApplicationConstants.APP_URL + "/songs/files/" + song.getFileName();
        songResponse.setUrl(url);
        String imagePath = ApplicationConstants.APP_URL + "/songs/images/" + song.getImageName();
        songResponse.setImagePath(imagePath);
        return songResponse;
    }
}
