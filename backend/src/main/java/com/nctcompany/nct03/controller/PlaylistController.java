package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.playlist.AddSongPlaylistRequest;
import com.nctcompany.nct03.dto.playlist.PlaylistDetailsResponse;
import com.nctcompany.nct03.dto.playlist.PlaylistRequest;
import com.nctcompany.nct03.dto.playlist.PlaylistResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.exception.BadRequestException;
import com.nctcompany.nct03.model.User;
import com.nctcompany.nct03.service.PlaylistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@RequestMapping("/v1/playlists")
@RestController
@RequiredArgsConstructor
@Validated
@Tag(
        name = "Playlist API"
)
@SecurityRequirement(
        name = "Bear Authentication"
)
public class PlaylistController {

    private final PlaylistService playlistService;

    @Operation(
            summary = "Create new playlist"
    )
    @PostMapping
    public ResponseEntity<PlaylistResponse> createPlaylist(
            @Valid @RequestBody PlaylistRequest request
    ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) authentication.getPrincipal();
        PlaylistResponse playlist = playlistService.createPlaylist(request, loggedUser);
        return new ResponseEntity<>(playlist, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Delete playlist"
    )
    @DeleteMapping("/{playlistId}")
    public ResponseEntity<Void> deletePlaylist(
            @PathVariable Long playlistId
    ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) authentication.getPrincipal();
        playlistService.deletePlaylist(playlistId, loggedUser);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Check song in playlist"
    )
    @GetMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<Boolean> checkSongInPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long songId
    ) {
        boolean songInPlaylist = playlistService.isSongInPlaylist(playlistId, songId);
        if (songInPlaylist) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

    @Operation(
            summary = "Add song to playlist"
    )
    @PostMapping("/{playlistId}/songs")
    public ResponseEntity<PlaylistDetailsResponse> addSongToPlaylist(
            @PathVariable Long playlistId,
            @Valid @RequestBody AddSongPlaylistRequest request
            ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) authentication.getPrincipal();
        PlaylistDetailsResponse response = playlistService.addSongToPlaylist(playlistId, request, loggedUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Get songs in playlist (include pagination)"
    )
    @GetMapping("/{playlistId}/songs")
    public ResponseEntity<PageableResult<SongResponse>> getSongsInPlaylist(
            @PathVariable Long playlistId,
            @Parameter(description = "Page number (default: 1)", example = "1", in = ParameterIn.QUERY)
            @RequestParam(value="pageNum", required = false, defaultValue = "1") @Min(value = 1) Integer pageNum,
            @Parameter(description = "Page size (default: 5, min: 5, max: 20)", example = "5", in = ParameterIn.QUERY)
            @RequestParam(value="pageSize", required = false, defaultValue = "5") @Min(value = 5) @Max(value = 20)  Integer pageSize
    ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) authentication.getPrincipal();
        PageableResult<SongResponse> songsPage = playlistService.getSongInPlaylist(playlistId, loggedUser, pageNum, pageSize);
        return ResponseEntity.ok(songsPage);
    }

    @Operation(
            summary = "Remove song from playlist"
    )
    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDetailsResponse> removeSongFromPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long songId
    ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) authentication.getPrincipal();
        PlaylistDetailsResponse response = playlistService.removeSongInPlaylist(playlistId, songId, loggedUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/checkSongInPlaylists")
    public List<Boolean> checkSongInPlaylists(@RequestParam String playlistIds, @RequestParam Long songId) {
        List<Long> playlistIdList = Arrays.stream(playlistIds.split(","))
                .map(id -> {
                    try {
                        return Long.parseLong(id);
                    } catch (NumberFormatException e) {
                        throw new BadRequestException("Invalid song id: " + id);
                    }
                })
                .collect(Collectors.toList());
        return playlistService.checkSongInPlaylists(playlistIdList, songId);
    }
}
