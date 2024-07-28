package com.nctcompany.nct03.dto.song;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class SongRequest {

    @NotBlank(message = "Song name is required")
    @Size(max = 128, message = "Song name cannot exceed 128 characters")
    private String name;

    private MultipartFile imageFile;

    @NotNull(message = "Song file is required")
    private MultipartFile songFile;

    @NotNull(message = "Genre id is required")
    private Integer genreId;

    @NotNull(message = "Artist id is required")
    private Long artistId;
}
