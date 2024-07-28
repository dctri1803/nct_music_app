package com.nctcompany.nct03.dto.playlist;

import com.nctcompany.nct03.dto.song.SongResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PlaylistDetailsResponse extends PlaylistResponse{

    private List<SongResponse> songs;
}
