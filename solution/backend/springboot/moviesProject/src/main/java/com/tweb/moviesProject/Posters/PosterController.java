package com.tweb.moviesProject.Posters;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // Marks this class as a REST controller
@RequestMapping("/api/posters") // Base URL mapping for all endpoints in this controller
public class PosterController {

    private final PosterService posterService;

    @Autowired // Injects PosterService dependency
    public PosterController(PosterService posterService) {
        this.posterService = posterService;
    }

    @Operation(summary = "Get poster link URL for a specific movie by its ID")
    @GetMapping("/movie/{movieId}") // Maps HTTP GET requests to this method
    public ResponseEntity<String> getPosterByMovieId(@PathVariable Long movieId) {
        // Calls the service to get the poster link for the given movie ID
        String posterLink = posterService.getPosterByMovieId(movieId);

        // Returns 204 No Content if the link is null or empty, otherwise returns 200 OK with the link
        return (posterLink == null || posterLink.isEmpty())
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(posterLink);
    }
}
