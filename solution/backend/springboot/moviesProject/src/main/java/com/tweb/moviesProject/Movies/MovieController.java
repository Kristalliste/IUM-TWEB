package com.tweb.moviesProject.Movies;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Movies API", description = "Endpoints for managing movies")
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    // Service layer for movie-related business logic
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

    @Operation(summary = "Get paginated movies by language")
    @GetMapping("/search/language")
    public ResponseEntity<Page<MovieDTO>> getMoviesByLanguage(@RequestParam String language, Pageable pageable) {
        Page<MovieDTO> movies = movieService.findByLanguageIgnoreCaseDTO(language, pageable);
        return ResponseEntity.ok(movies);
    }

    @Operation(summary = "Get paginated movies by actor")
    @GetMapping("/search/actor")
    public ResponseEntity<Page<MovieDTO>> getMoviesByActor(@RequestParam String actor, Pageable pageable) {
        Page<MovieDTO> movies = movieService.findByActorIgnoreCase(actor, pageable);
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
    @Transactional(readOnly = true) // Ensures the transaction is read-only for performance
    public ResponseEntity<MovieDTO> getMovieDetails(@PathVariable Long id) {
        MovieDTO movieDetails = movieService.getMovieDetails(id);
        return ResponseEntity.ok(movieDetails);
    }

    @Operation(summary = "Get paginated recent movies")
    @GetMapping("/recent")
    public ResponseEntity<Page<MovieDTO>> getRecentMovies(Pageable pageable) {
        Page<MovieDTO> movies = movieService.getAllMoviesOrderedByDateDescDTO(pageable);
        return ResponseEntity.ok(movies);
    }

    @Operation(summary = "Get paginated top rated movies")
    @GetMapping("/top-rated")
    public ResponseEntity<Page<MovieDTO>> getTopRatedMovies(Pageable pageable) {
        Page<MovieDTO> movies = movieService.getAllMoviesOrderedByRatingDescDTO(pageable);
        return ResponseEntity.ok(movies);
    }
}
