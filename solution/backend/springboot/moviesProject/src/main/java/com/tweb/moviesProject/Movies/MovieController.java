package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Enums;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {this.movieService = movieService;}

    @GetMapping("/search/{type}/{query}/{page}/{size}")
    public ResponseEntity<Page<MovieDTO>> searchMovies(
            @PathVariable Enums.SearchType type, //enum with the types of search
            @PathVariable String query,
            @PathVariable int page,
            @PathVariable int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> resultPage;

        switch (type) {
            case TITLE -> resultPage = movieService.findByTitleIgnoreCase(query, pageable);
            case YEAR -> {
                try {
                    resultPage = movieService.findByYear(Integer.parseInt(query), pageable);
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().build();
                }
            }
            case GENRE -> resultPage = movieService.findByGenreIgnoreCase(query, pageable);

            default -> {
                return ResponseEntity.badRequest().build();
            }
        }

        if (resultPage.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Mappa Movie -> MovieDTO
        Page<MovieDTO> dtoPage = resultPage.map(movie -> new MovieDTO(
                movie.getMovieId(),
                movie.getTitle(),
                movie.getDate(),
                movie.getTagline(),
                movie.getDescription(),
                movie.getMinute(),
                movie.getRating()
        ));

        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/genres")
    public ResponseEntity<List<String>> getGenres() {
        List<String> genres = movieService.getAllGenres();
        return genres.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(genres);
    }

    @GetMapping("/all/{page}/{size}")
    public ResponseEntity<Page<MovieDTO>> getMovies(
            @PathVariable int page,
            @PathVariable int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> moviePage = movieService.getAllMovies(pageable);

        // Mappa Movie -> MovieDTO
        Page<MovieDTO> movies = moviePage.map(movie -> new MovieDTO(
                movie.getMovieId(),
                movie.getTitle(),
                movie.getDate(),
                movie.getTagline(),
                movie.getDescription(),
                movie.getMinute(),
                movie.getRating()
        ));
        return ResponseEntity.ok(movies);
    }
}
