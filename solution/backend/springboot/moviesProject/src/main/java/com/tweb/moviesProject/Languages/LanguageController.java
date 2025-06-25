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

    // Constructor injection for LanguageService dependency
    public LanguageController(LanguageService languageService) {
        this.languageService = languageService;
    }

    // Returns all language names for a specific movie by its ID
    @Operation(summary = "Get all language entities for a specific movie")
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<String>> getLanguagesByMovieId(@PathVariable Long movieId) {
        List<String> languages = languageService.getLanguageNamesByMovieId(movieId);
        return ResponseEntity.ok(languages);
    }

    // Returns all language names for a specific movie, returns 204 if empty
    @Operation(summary = "Get all language names for a specific movie")
    @GetMapping("/names/movie/{movieId}")
    public ResponseEntity<List<String>> getLanguageNamesByMovieId(@PathVariable Long movieId) {
        List<String> languageNames = languageService.getLanguageNamesByMovieId(movieId);
        return languageNames.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(languageNames);
    }

    // Returns all Language entities by language name, returns 204 if empty
    @Operation(summary = "Get all Language entities by language name")
    @GetMapping("/{languageName}")
    public ResponseEntity<List<Language>> getLanguagesByName(@PathVariable String languageName) {
        List<Language> languages = languageService.getLanguagesByName(languageName);
        return languages.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(languages);
    }
}