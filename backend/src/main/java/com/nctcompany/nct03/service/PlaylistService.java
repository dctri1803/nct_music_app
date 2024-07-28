package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.playlist.AddSongPlaylistRequest;
import com.nctcompany.nct03.dto.playlist.PlaylistRequest;
import com.nctcompany.nct03.dto.playlist.PlaylistDetailsResponse;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.model.User;

import java.util.List;

public interface PlaylistService {
    PlaylistResponse createPlaylist(PlaylistRequest request, User user);
    PlaylistDetailsResponse addSongToPlaylist(Long playlistId, AddSongPlaylistRequest request, User user);
    PlaylistDetailsResponse removeSongInPlaylist(Long playlistId, Long songId, User user);
    void deletePlaylist(Long playlistId, User user);
    PageableResult<SongResponse> getSongInPlaylist(Long playlistId, User user, Integer pageNum, Integer pageSize);

    boolean isSongInPlaylist(Long playlistId, Long songId);
    List<Boolean> checkSongInPlaylists(List<Long> playlistIds, Long songId);
}

