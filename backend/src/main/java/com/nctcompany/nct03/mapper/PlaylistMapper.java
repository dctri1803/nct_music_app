package com.nctcompany.nct03.mapper;

import com.nctcompany.nct03.dto.playlist.PlaylistDetailsResponse;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.model.Playlist;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PlaylistMapper {

    private final ModelMapper mapper;

    public static PlaylistResponse mapToResponse(Playlist playlist){
        PlaylistResponse response = new PlaylistResponse();
        response.setId(playlist.getId());
        response.setName(playlist.getName());
        response.setTotalSongs(playlist.getSongs().size());
        return response;
    }

    public PlaylistDetailsResponse mapToDetailsResponse(Playlist playlist){
        PlaylistDetailsResponse response = new PlaylistDetailsResponse();
        response.setId(playlist.getId());
        response.setName(playlist.getName());
        response.setTotalSongs(playlist.getSongs().size());
        List<SongResponse> songs = playlist.getSongs().stream()
                .map(SongMapper::mapToSongResponse)
                .collect(Collectors.toList());
        Collections.reverse(songs);
        response.setSongs(songs);
        return response;
    }
}
