package com.nctcompany.nct03.dto.genre;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GenreResponse {

    private Integer id;
    private String name;
}
