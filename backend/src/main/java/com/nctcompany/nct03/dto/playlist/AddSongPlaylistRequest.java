package com.nctcompany.nct03.dto.playlist;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddSongPlaylistRequest {

    @NotNull(message = "Song Id is required")
    private Long songId;
}
