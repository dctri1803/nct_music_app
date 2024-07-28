package com.nctcompany.nct03.dto.playlist;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaylistRequest {

    @NotBlank(message = "Playlist name is required")
    @Size(max = 128, message = "Playlist name can not exceed 128 characters")
    private String name;
}
