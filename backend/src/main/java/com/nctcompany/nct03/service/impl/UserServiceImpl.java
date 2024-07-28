package com.nctcompany.nct03.service.impl;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.dto.user.ChangePasswordRequest;
import com.nctcompany.nct03.dto.user.UpdateUserRequest;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.exception.BadRequestException;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.mapper.PlaylistMapper;
import com.nctcompany.nct03.mapper.SongMapper;
import com.nctcompany.nct03.mapper.UserMapper;
import com.nctcompany.nct03.model.Playlist;
import com.nctcompany.nct03.model.Song;
import com.nctcompany.nct03.model.User;
import com.nctcompany.nct03.repository.PlaylistRepository;
import com.nctcompany.nct03.repository.SongRepository;
import com.nctcompany.nct03.repository.UserRepository;
import com.nctcompany.nct03.service.UserService;
import com.nctcompany.nct03.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PlaylistMapper playlistMapper;
    private final SongRepository songRepository;
    private final PlaylistRepository playlistRepository;

    @Override
    public UserResponse getUserProfile(Principal loggedUser) {
        User user = (User) ((UsernamePasswordAuthenticationToken) loggedUser).getPrincipal();
        return UserMapper.mapToResponse(user);
    }

    @Override
    public void changePassword(ChangePasswordRequest request, Principal loggedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) loggedUser).getPrincipal();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Wrong password");
        }
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new BadRequestException("Password are not the same");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    @Override
    public UserResponse updateUser(UpdateUserRequest request, Principal loggedUser) throws IOException {
        User user = (User) ((UsernamePasswordAuthenticationToken) loggedUser).getPrincipal();

        if (request.getName() != null && !request.getName().isBlank() && !request.getName().equals(user.getName())){
            user.setName(request.getName());
        }

        if (request.getPhotoFile() != null && !request.getPhotoFile().isEmpty()){
            if (!FileUploadUtil.checkUploadImageTypeFile(request.getPhotoFile())){
                throw new BadRequestException("Please provide the user image in JPG/PNG format");
            }
            if (!(user.getPhoto() == null) && !user.getPhoto().equals(ApplicationConstants.DEFAULT_IMAGE)){
                FileUploadUtil.deleteImage(ApplicationConstants.USERS_FOLDER, user.getPhoto());
            }
            String photoName = FileUploadUtil.generateImageName(request.getPhotoFile());
            user.setPhoto(photoName);
            FileUploadUtil.saveFile(ApplicationConstants.USERS_FOLDER, photoName, request.getPhotoFile());
        }

        User udpatedUser = userRepository.save(user);
        return UserMapper.mapToResponse(udpatedUser);
    }

    @Override
    public PageableResult<PlaylistResponse> getCurrentUserPlaylists(Integer pageNum, Integer pageSize) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Page<Playlist> playlistPage = playlistRepository.findByUserIdOrderByIdDesc(user.getId(), PageRequest.of(pageNum - 1, pageSize));
        List<PlaylistResponse> playlists = playlistPage.getContent().stream()
                .map(PlaylistMapper::mapToResponse)
                .collect(Collectors.toList());
        return PageableResult.<PlaylistResponse>builder()
                .items(playlists)
                .pageNum(playlistPage.getNumber()+1)
                .pageSize(playlistPage.getSize())
                .totalItems(playlistPage.getTotalElements())
                .totalPages(playlistPage.getTotalPages())
                .build();
    }

    @Override
    public void likesSong(User loggedUser, Long songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song with id=[%s] not found".formatted(songId)));
        List<Song> likedSongs = userRepository.findLikedSongsByUserId(loggedUser.getId());
        if (likedSongs.contains(song)){
            throw new BadRequestException("You already like this song");
        }
        userRepository.likeSong(loggedUser.getId(), songId);
    }

    @Override
    public void unlikeSong(User loggedUser, Long songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song with id=[%s] not found".formatted(songId)));
        List<Song> likedSongs = userRepository.findLikedSongsByUserId(loggedUser.getId());
        if (!likedSongs.contains(song)){
            throw new BadRequestException("You don't like this song");
        }
        userRepository.unlikeSong(loggedUser.getId(), songId);
    }

    @Override
    public boolean isUserLikeSong(User loggedUser, Long songId) {
        List<Song> likedSongs = userRepository.findLikedSongsByUserId(loggedUser.getId());
        return likedSongs.stream()
                .filter(s -> s.getId().equals(songId))
                .findFirst()
                .isPresent();
    }

    @Override
    public PageableResult<SongResponse> getFavoriteSongs(User loggedUser, Integer pageNum, Integer pageSize) {
        List<Song> likedSongs = userRepository.findLikedSongsByUserId(loggedUser.getId());
        List<SongResponse> songResponses = likedSongs.stream()
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

    public List<Boolean> checkUserLikedSongs(User loggedUser, List<Long> songIds) {
        return songIds.stream()
                .map(songId -> songRepository.isSongLikedByUser(loggedUser.getId(), songId))
                .collect(Collectors.toList());
    }
}
