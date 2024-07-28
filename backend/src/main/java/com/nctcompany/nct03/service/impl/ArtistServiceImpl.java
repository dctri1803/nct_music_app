package com.nctcompany.nct03.service.impl;

import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.mapper.ArtistMapper;
import com.nctcompany.nct03.mapper.SongMapper;
import com.nctcompany.nct03.model.Artist;
import com.nctcompany.nct03.model.Song;
import com.nctcompany.nct03.repository.ArtistRepository;
import com.nctcompany.nct03.repository.SongRepository;
import com.nctcompany.nct03.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;

    @Override
    public PageableResult<ArtistResponse> getAllArtists(Integer pageNum, Integer pageSize) {
        Page<Artist> artistsPage = artistRepository.findAll(PageRequest.of(pageNum, pageSize));
        List<ArtistResponse> artists = artistsPage.getContent().stream()
                .map(ArtistMapper::mapToResponse)
                .collect(Collectors.toList());
        return PageableResult.<ArtistResponse>builder()
                .items(artists)
                .pageNum(artistsPage.getNumber() + 1)
                .pageSize(artistsPage.getSize())
                .totalItems(artistsPage.getTotalElements())
                .totalPages(artistsPage.getTotalPages())
                .build();
    }

    @Override
    public ArtistResponse getArtistDetails(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist with id=[%s] not found".formatted(artistId)));
        return ArtistMapper.mapToResponse(artist);
    }

    @Override
    public PageableResult<SongResponse> getSongsByArtist(Long artistId, Integer pageNum, Integer pageSize) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist with id=[%s] not found".formatted(artistId)));
        Page<Song> songsPage = songRepository.findByArtistsContaining(artist, PageRequest.of(pageNum-1, pageSize));
        List<SongResponse> songs = songsPage.getContent().stream()
                .map(SongMapper::mapToSongResponse)
                .collect(Collectors.toList());
        return PageableResult.<SongResponse>builder()
                .items(songs)
                .pageNum(songsPage.getNumber()+1)
                .pageSize(songsPage.getSize())
                .totalItems(songsPage.getTotalElements())
                .totalPages(songsPage.getTotalPages())
                .build();
    }

    @Override
    public PageableResult<ArtistResponse> searchArtists(String keyword, Integer pageNum, Integer pageSize) {
        Page<Artist> artistPage = artistRepository.findByNameContainingIgnoreCase(keyword, PageRequest.of(pageNum-1, pageSize));
        List<ArtistResponse> artists = artistPage.getContent().stream()
                .map(ArtistMapper::mapToResponse)
                .collect(Collectors.toList());
        return PageableResult.<ArtistResponse>builder()
                .items(artists)
                .pageNum(artistPage.getNumber()+1)
                .pageSize(artistPage.getSize())
                .totalItems(artistPage.getTotalElements())
                .totalPages(artistPage.getTotalPages())
                .build();
    }
}
