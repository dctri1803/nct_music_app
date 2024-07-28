package com.nctcompany.nct03.dto.playlist;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaylistResponse {
    private Long id;
    private String name;
    private long totalSongs;
}
