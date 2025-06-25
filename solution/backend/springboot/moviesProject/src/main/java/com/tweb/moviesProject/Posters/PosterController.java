/*package com.tweb.moviesProject.Posters;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posters")
public class PosterController {

    private final PosterService posterService;

    @Autowired
    public PosterController(PosterService posterService) {
        this.posterService = posterService;
    }

    @Operation(summary = "Get poster link URL for a specific movie by its ID")
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<String> getPosterByMovieId(@PathVariable Long movieId) {
        String posterLink = posterService.getPosterByMovieId(movieId);

        return (posterLink == null || posterLink.isEmpty())
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(posterLink);
    }
}
*/