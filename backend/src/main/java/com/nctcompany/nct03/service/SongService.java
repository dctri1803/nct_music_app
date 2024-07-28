package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.song.SongRequest;
import com.nctcompany.nct03.dto.song.SongResponse;

import java.io.IOException;

public interface SongService {

    PageableResult<SongResponse> getRecentlyReleasedSong(Integer pageNum, Integer pageSize);
    PageableResult<SongResponse> getMostLikedSongs(Integer pageNum, Integer pageSize);
    SongResponse getSongById(Long id);
    PageableResult<SongResponse> searchSongs(String keyword, Integer pageNum, Integer pageSize);
    SongResponse createSong(SongRequest songRequest) throws IOException;
}
