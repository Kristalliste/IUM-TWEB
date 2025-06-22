package com.tweb.moviesProject.Genres;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreService genreService;

    @Autowired
    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Genre>> getGenresByMovieId(@PathVariable Long movieId) {
        List<Genre> genres = genreService.getGenresByMovieId(movieId);
        return genres.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(genres);
    }

    @GetMapping("/names/movie/{movieId}")
    public ResponseEntity<List<String>> getGenreNamesByMovieId(@PathVariable Long movieId) {
        List<String> genreNames = genreService.getGenreNamesByMovieId(movieId);
        return genreNames.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(genreNames);
    }

    @GetMapping("/{genreName}")
    public ResponseEntity<List<Genre>> getGenresByName(@PathVariable String genreName) {
        List<Genre> genres = genreService.getGenresByName(genreName);
        return genres.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(genres);
    }

    @Operation(summary = "Get all distinct movie genres")
    @GetMapping("allGenres")
    public ResponseEntity<List<String>> getAllGenres() {
        List<String> genres = genreService.getAllGenres();
        return ResponseEntity.ok(genres);
    }
}
