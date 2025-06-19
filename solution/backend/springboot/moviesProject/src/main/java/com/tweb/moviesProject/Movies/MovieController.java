package com.tweb.moviesProject.Movies;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Movies API", description = "Endpoints for managing movies")
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @Operation(summary = "Get paginated movies by title (case insensitive)")
    @GetMapping("/search/title")
    public ResponseEntity<Page<MovieDTO>> getMoviesByTitle(@RequestParam String title, Pageable pageable) {
        Page<MovieDTO> movies = movieService.findByTitleIgnoreCaseDTO(title, pageable);
        return ResponseEntity.ok(movies);
    }

    @Operation(summary = "Get paginated movies by release year")
    @GetMapping("/search/year")
    public ResponseEntity<Page<MovieDTO>> getMoviesByYear(@RequestParam Integer year, Pageable pageable) {
        Page<MovieDTO> movies = movieService.findByYearDTO(year, pageable);
        return ResponseEntity.ok(movies);
    }

    @Operation(summary = "Get paginated movies by genre")
    @GetMapping("/search/genre")
    public ResponseEntity<Page<MovieDTO>> getMoviesByGenre(@RequestParam String genre, Pageable pageable) {
        Page<MovieDTO> movies = movieService.findByGenreIgnoreCaseDTO(genre, pageable);
        return ResponseEntity.ok(movies);
    }

    @Operation(summary = "Get paginated list of all movies")
    @GetMapping
    public ResponseEntity<Page<MovieDTO>> getAllMovies(Pageable pageable) {
        Page<MovieDTO> movies = movieService.getAllMoviesDTO(pageable);
        return ResponseEntity.ok(movies);
    }

    @Operation(summary = "Get detailed movie information by ID")
    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> getMovieDetails(@PathVariable("id") Integer movieId) {
        MovieDTO movieDetails = movieService.getMovieDetails(movieId);
        if (movieDetails == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(movieDetails);
    }

}
