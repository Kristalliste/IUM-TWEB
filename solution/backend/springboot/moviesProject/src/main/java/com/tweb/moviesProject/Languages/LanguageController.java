package com.tweb.moviesProject.Languages;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/languages")
@Tag(name = "Languages", description = "Endpoints for retrieving movie languages")
public class LanguageController {

    private final LanguageService languageService;

    public LanguageController(LanguageService languageService) {
        this.languageService = languageService;
    }

    @Operation(summary = "Get all languages for a specific movie")
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Language>> getLanguagesByMovieId(@PathVariable Long movieId) {
        List<Language> languages = languageService.getLanguagesByMovieId(movieId);
        return ResponseEntity.ok(languages);
    }

    @ExceptionHandler(LanguageNotFoundException.class)
    public ResponseEntity<String> handleLanguageNotFound(LanguageNotFoundException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }
}


