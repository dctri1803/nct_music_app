package com.nctcompany.nct03.dto.genre;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class GenreRequest {

    @NotBlank(message = "Genre name is required")
    @Size(max = 64, message = "Genre name cannot exceed 64 characters")
    private String name;
}
