package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Enums;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {this.movieService = movieService;}

    @GetMapping("/search")
    public Page<Movie> searchMovies(
            @RequestParam Enums.SearchType type, //enum with the types of search
            @RequestParam String query,
            @RequestParam int page,
            @RequestParam int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        return switch (type) {
            case TITLE -> movieService.findByTitleIgnoreCase(query, pageable);
            case YEAR -> {
                try {
                    yield movieService.findByYear(Integer.parseInt(query), pageable);
                } catch (NumberFormatException e) {
                    yield Page.empty(); // gestisce input non numerico
                }
            }
            default -> Page.empty();
        };
    }
}
