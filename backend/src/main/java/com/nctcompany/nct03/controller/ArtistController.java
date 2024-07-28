package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.artist.ArtistResponse;
import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.service.ArtistService;
import com.nctcompany.nct03.util.FileUploadUtil;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;

@RequestMapping("/v1/artists")
@RestController
@RequiredArgsConstructor
@Validated
@Tag(
        name = "Artist API"
)
@SecurityRequirement(name = "Bear Authentication")
public class ArtistController {

    private final ArtistService artistService;

    @Operation(
            summary = "Get all artists (include pagination)"
    )
    @GetMapping
    public ResponseEntity<PageableResult<ArtistResponse>> getAllArtists(
            @Parameter(description = "Page number (default: 1)", example = "1", in = ParameterIn.QUERY)
                @RequestParam(value="pageNum", required = false, defaultValue = "1") @Min(value = 1) Integer pageNum,
            @Parameter(description = "Page size (default: 5, min: 5, max: 20)", example = "5", in = ParameterIn.QUERY)
                @RequestParam(value="pageSize", required = false, defaultValue = "5") @Min(value = 5) @Max(value = 20)  Integer pageSize
    ){
        PageableResult<ArtistResponse> artists = artistService.getAllArtists(pageNum - 1, pageSize);
        return ResponseEntity.ok(artists);
    }

    @Operation(
            summary = "Get artist details"
    )
    @GetMapping("/{artistId}")
    public ResponseEntity<ArtistResponse> getArtistDetails(
            @PathVariable Long artistId
    ){
        return ResponseEntity.ok(artistService.getArtistDetails(artistId));
    }

    @Operation(
            summary = "Get artist's songs (include pagination)"
    )
    @GetMapping("/{artistId}/songs")
    public ResponseEntity<PageableResult<SongResponse>> getSongsByArtist(
            @PathVariable Long artistId,
            @Parameter(description = "Page number (default: 1)", example = "1", in = ParameterIn.QUERY)
                @RequestParam(value="pageNum", required = false, defaultValue = "1") @Min(value = 1) Integer pageNum,
            @Parameter(description = "Page size (default: 5, min: 5, max: 20)", example = "5", in = ParameterIn.QUERY)
                @RequestParam(value="pageSize", required = false, defaultValue = "5") @Min(value = 5) @Max(value = 20)  Integer pageSize

    ){
        PageableResult<SongResponse> songsByArtist = artistService.getSongsByArtist(artistId, pageNum, pageSize);
        return ResponseEntity.ok(songsByArtist);
    }

    @Operation(
            summary = "Search artists by name"
    )
    @GetMapping("/search")
    public ResponseEntity<PageableResult<ArtistResponse>> searchArtists(
            @RequestParam String keyword,
            @Parameter(description = "Page number (default: 1)", example = "1", in = ParameterIn.QUERY)
            @RequestParam(value="pageNum", required = false, defaultValue = "1") @Min(value = 1) Integer pageNum,
            @Parameter(description = "Page size (default: 5, min: 5, max: 20)", example = "5", in = ParameterIn.QUERY)
            @RequestParam(value="pageSize", required = false, defaultValue = "5") @Min(value = 5) @Max(value = 20)  Integer pageSize
    ) {
        return ResponseEntity.ok(artistService.searchArtists(keyword, pageNum, pageSize));
    }

    @Hidden
    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewArtistImage(@PathVariable String imageName) {
        try {
            UrlResource resource = FileUploadUtil.getUrlResource(imageName, ApplicationConstants.ARTISTS_FOLDER);
            MediaType mediaType = FileUploadUtil.determineMediaType(imageName);
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(resource);
        }catch (MalformedURLException e){
            throw new ResourceNotFoundException("Could not found image name: " + imageName);
        }
    }
}
