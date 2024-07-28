package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.genre.GenreResponse;
import com.nctcompany.nct03.dto.song.SongResponse;

import java.util.List;

public interface GenreService {

    List<GenreResponse> getAllGenres();

    PageableResult<SongResponse> getSongsByGenre(Integer genreId, Integer pageNum, Integer pageSize);
}
