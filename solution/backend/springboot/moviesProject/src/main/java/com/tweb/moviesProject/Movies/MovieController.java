package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Enums;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {this.movieService = movieService;}

    @GetMapping("/search/{type}/{query}/{page}/{size}")
    public ResponseEntity<Page<Movie>> searchMovies(
            @PathVariable Enums.SearchType type, //enum with the types of search
            @PathVariable String query,
            @PathVariable int page,
            @PathVariable int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        return switch (type) {
            case TITLE -> movieService.findByTitleIgnoreCase(query, pageable);
            case YEAR -> {
                try {
                     movieService.findByYear(Integer.parseInt(query), pageable);
                } catch (NumberFormatException e) {
                    yield Page.empty(); // gestisce input non numerico
                }
            }
            default -> Page.empty();
        };
    }
}
