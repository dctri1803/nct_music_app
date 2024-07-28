package com.nctcompany.nct03.service.impl;

import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.playlist.AddSongPlaylistRequest;
import com.nctcompany.nct03.dto.playlist.PlaylistRequest;
import com.nctcompany.nct03.dto.playlist.PlaylistDetailsResponse;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.exception.BadRequestException;
import com.nctcompany.nct03.exception.DuplicateResourceException;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.mapper.PlaylistMapper;
import com.nctcompany.nct03.mapper.SongMapper;
import com.nctcompany.nct03.model.Playlist;
import com.nctcompany.nct03.model.Song;
import com.nctcompany.nct03.model.User;
import com.nctcompany.nct03.repository.PlaylistRepository;
import com.nctcompany.nct03.repository.SongRepository;
import com.nctcompany.nct03.repository.UserRepository;
import com.nctcompany.nct03.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistServiceImpl implements PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistMapper playlistMapper;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    @Override
    public PlaylistResponse createPlaylist(PlaylistRequest request, User user) {
        if (playlistRepository.existsByNameAndUser(request.getName(), user)){
            throw new DuplicateResourceException("Playlist name=[%s] already existed!".formatted(request.getName()));
        }
        Playlist playlist = new Playlist();
        playlist.setName(request.getName());
        playlist.setUser(user);

        Playlist savedPlaylist = playlistRepository.save(playlist);
        return playlistMapper.mapToResponse(savedPlaylist);
    }

    @Override
    public PlaylistDetailsResponse addSongToPlaylist(Long playlistId, AddSongPlaylistRequest request, User user) {
        Playlist playlist = playlistRepository.findByIdAndUserId(playlistId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Playlist with id=[%s] not found".formatted(playlistId)));
        Song song = songRepository.findById(request.getSongId())
                .orElseThrow(() -> new ResourceNotFoundException("Song with id=[%s] not found".formatted(request.getSongId())));
        if (playlist.getSongs().contains(song)){
            throw new BadRequestException("Song with id=[%s] already existed in playlist with id=[%s]".formatted(song.getId(), playlist.getId()));
        }
        playlist.getSongs().add(song);

        Playlist savedPlaylist = playlistRepository.save(playlist);

        return playlistMapper.mapToDetailsResponse(savedPlaylist);
    }

    @Override
    public PlaylistDetailsResponse removeSongInPlaylist(Long playlistId, Long songId, User user) {
        Playlist playlist = playlistRepository.findByIdAndUserId(playlistId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Playlist with id=[%s] not found".formatted(playlistId)));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song with id=[%s] not found".formatted(songId)));
        if (!playlist.getSongs().contains(song)){
            throw new BadRequestException("Song with id=[%s] does not exist in playlist with id=[%s]".formatted(song.getId(), playlist.getId()));
        }
        playlist.getSongs().remove(song);
        Playlist updatedPlaylist = playlistRepository.save(playlist);

        return playlistMapper.mapToDetailsResponse(updatedPlaylist);
    }

    @Override
    public void deletePlaylist(Long playlistId, User user) {
        Playlist playlist = playlistRepository.findByIdAndUserId(playlistId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Playlist with id=[%s] not found".formatted(playlistId)));
        playlistRepository.deleteById(playlist.getId());
    }

    @Override
    public PageableResult<SongResponse> getSongInPlaylist(Long playlistId, User user, Integer pageNum, Integer pageSize) {
        Playlist playlist = playlistRepository.findByIdAndUserId(playlistId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Playlist with id=[%s] not found".formatted(playlistId)));

        List<SongResponse> songResponses = playlist.getSongs().stream()
                .map(SongMapper::mapToSongResponse)
                .collect(Collectors.toList());

        Collections.reverse(songResponses);

        int totalItems = songResponses.size();
        int totalPages = (int) Math.ceil((double) totalItems / pageSize);
        int fromIndex = (pageNum - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, totalItems);

        return PageableResult.<SongResponse>builder()
                .items(songResponses.subList(fromIndex, toIndex))
                .pageNum(pageNum)
                .pageSize(pageSize)
                .totalItems(totalItems)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public boolean isSongInPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist with id=[%s] not found".formatted(playlistId)));
        return playlist.getSongs().stream()
                .filter(song -> song.getId().equals(songId))
                .findFirst()
                .isPresent();
    }

    public List<Boolean> checkSongInPlaylists(List<Long> playlistIds, Long songId) {
        List<Boolean> results = new ArrayList<>();
        for (Long playlistId : playlistIds) {
            results.add(playlistRepository.isSongInPlaylist(playlistId, songId));
        }
        return results;
    }
}
