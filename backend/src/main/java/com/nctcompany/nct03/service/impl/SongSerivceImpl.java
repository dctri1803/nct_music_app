package com.nctcompany.nct03.service.impl;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.song.SongRequest;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.exception.BadRequestException;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.mapper.SongMapper;
import com.nctcompany.nct03.model.Artist;
import com.nctcompany.nct03.model.Genre;
import com.nctcompany.nct03.model.Song;
import com.nctcompany.nct03.repository.ArtistRepository;
import com.nctcompany.nct03.repository.GenreRepository;
import com.nctcompany.nct03.repository.SongRepository;
import com.nctcompany.nct03.service.SongService;
import com.nctcompany.nct03.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongSerivceImpl implements SongService {

    private final SongRepository songRepository;
    private final GenreRepository genreRepository;
    private final ArtistRepository artistRepository;

    @Override
    public PageableResult<SongResponse> getRecentlyReleasedSong(Integer pageNum, Integer pageSize) {
        Page<Song> songsPage = songRepository.findLatestReleasedSongs(PageRequest.of(pageNum-1, pageSize));
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
    public PageableResult<SongResponse> getMostLikedSongs(Integer pageNum, Integer pageSize) {
        Page<Song> songsPage = songRepository.findMostLikedSongs(PageRequest.of(pageNum-1, pageSize));
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
    public SongResponse getSongById(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song with id=[%s] can not found!".formatted(id)));
        return SongMapper.mapToSongResponse(song);
    }

    @Override
    public PageableResult<SongResponse> searchSongs(String keyword, Integer pageNum, Integer pageSize) {
        Page<Song> songsPage = songRepository.findByNameContainingIgnoreCase(keyword, PageRequest.of(pageNum-1, pageSize));
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
    public SongResponse createSong(SongRequest songRequest) throws IOException {
        if (!FileUploadUtil.checkUploadAudioTypeFile(songRequest.getSongFile())){
            throw new BadRequestException("Please provide the song file in MPEG format");
        }
        String songName = songRequest.getName();
        String fileName = generateFileName(songName, songRequest.getSongFile());
        
        String imgName = ApplicationConstants.DEFAULT_IMAGE;
        if (songRequest.getImageFile() != null && !songRequest.getImageFile().isEmpty()){
            if (!FileUploadUtil.checkUploadImageTypeFile(songRequest.getImageFile())){
                throw new BadRequestException("Please provide the song image in JPG/PNG format");
            }
            imgName = FileUploadUtil.generateImageName(songRequest.getImageFile());
        }

        Song song = new Song();
        song.setName(songName);
        song.setImageName(imgName);
        song.setFileName(fileName);

        Genre genre = genreRepository.findById(songRequest.getGenreId())
                .orElseThrow(() -> new ResourceNotFoundException("Genre with id=[%s] not found".formatted(songRequest.getGenreId())));
        song.setGenre(genre);

        Artist artist = artistRepository.findById(songRequest.getArtistId())
                .orElseThrow(() -> new ResourceNotFoundException("Artist with id=[%s] not found".formatted(songRequest.getArtistId())));
        song.getArtists().add(artist);
        song.setReleasedOn(LocalDate.now());
        Song savedSong = songRepository.save(song);

        String fileFolderPath = ApplicationConstants.SONGS_FILE_FOLDER;
//        FileUploadUtil.cleanDir(fileFolderPath);
        FileUploadUtil.saveFile(fileFolderPath, fileName, songRequest.getSongFile());
        if (!savedSong.getImageName().equals(ApplicationConstants.DEFAULT_IMAGE)){
            String imgFolderPath = ApplicationConstants.SONGS_IMG_FOLDER;
//            FileUploadUtil.cleanDir(imgFolderPath);
            FileUploadUtil.saveFile(imgFolderPath, imgName, songRequest.getImageFile());
        }

        return SongMapper.mapToSongResponse(song);
    }
    
    private String generateFileName(String songName, MultipartFile file){
        String fileExtension = FileUploadUtil.getFileExtension(file);
    
        songName = FileUploadUtil.removeAccent(songName);
        String randomString = UUID.randomUUID().toString().substring(0, 7);
        String fileName = songName.replaceAll(" ", "") + "-" + randomString;
        
        return fileName + fileExtension;
    }

}
