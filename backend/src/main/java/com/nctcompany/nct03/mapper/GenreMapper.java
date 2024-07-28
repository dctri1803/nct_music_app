package com.nctcompany.nct03.mapper;

import com.nctcompany.nct03.dto.genre.GenreResponse;
import com.nctcompany.nct03.model.Genre;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

@RequiredArgsConstructor
public class GenreMapper {

    public static GenreResponse mapToResponse(Genre genre){
        return GenreResponse.builder()
                .id(genre.getId())
                .name(genre.getName())
                .build();
    }
}
