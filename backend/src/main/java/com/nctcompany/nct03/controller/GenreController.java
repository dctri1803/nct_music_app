package com.nctcompany.nct03.controller;

import com.nctcompany.nct03.dto.common.PageableResult;
import com.nctcompany.nct03.dto.genre.GenreResponse;
import com.nctcompany.nct03.dto.song.SongResponse;
import com.nctcompany.nct03.service.GenreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/v1/genres")
@RestController
@RequiredArgsConstructor
@Validated
@Tag(
        name = "Genre API"
)
@SecurityRequirement(
        name = "Bear Authentication"
)
public class GenreController {

    private final GenreService genreService;

    @Operation(
            summary = "Get all genres"
    )
    @GetMapping
    public ResponseEntity<List<GenreResponse>> getAllGenres(){
        return ResponseEntity.ok(genreService.getAllGenres());
    }

    @Operation(
            summary = "Get genre's songs (include pagination)"
    )
    @GetMapping("/{genreId}/songs")
    public ResponseEntity<PageableResult<SongResponse>> getSongsByGenre(
            @PathVariable Integer genreId,
            @Parameter(description = "Page number (default: 1)", example = "1", in = ParameterIn.QUERY)
                @RequestParam(value="pageNum", required = false, defaultValue = "1") @Min(value = 1) Integer pageNum,
            @Parameter(description = "Page size (default: 5, min: 5, max: 20)", example = "5", in = ParameterIn.QUERY)
                @RequestParam(value="pageSize", required = false, defaultValue = "5") @Min(value = 5) @Max(value = 20)  Integer pageSize

    ){
        PageableResult<SongResponse> songsByGenre = genreService.getSongsByGenre(genreId, pageNum, pageSize);
        return ResponseEntity.ok(songsByGenre);
    }

}
