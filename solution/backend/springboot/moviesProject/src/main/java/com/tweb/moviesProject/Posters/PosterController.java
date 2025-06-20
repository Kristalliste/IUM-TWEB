package com.tweb.moviesProject.Posters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<String> getPosterByMovieId(@PathVariable Long movieId) {
        try {
            String posterLink = posterService.getPosterByMovieId(movieId);
            return ResponseEntity.ok(posterLink);
        } catch (PosterNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @ExceptionHandler(PosterNotFoundException.class)
    public ResponseEntity<String> handlePosterNotFound(PosterNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
