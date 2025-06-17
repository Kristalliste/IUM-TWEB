package com.tweb.moviesProject.Languages;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
@Tag(name = "Languages", description = "Operations related to movie languages")
public class LanguageController {

    private final LanguageService languageService;

    public LanguageController(LanguageService languageService) {
        this.languageService = languageService;
    }

    @Operation(summary = "Get all languages (paginated)")
    @GetMapping
    public ResponseEntity<Page<Language>> getAllLanguages(Pageable pageable) {
        return ResponseEntity.ok(languageService.getAllLanguages(pageable));
    }

    @Operation(summary = "Get languages by movie ID (paginated)")
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Page<Language>> getLanguagesByMovieId(
            @PathVariable Long movieId,
            Pageable pageable) {
        Page<Language> result = languageService.getLanguagesByMovieId(movieId, pageable);
        return result.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(result);
    }

    @Operation(summary = "Search languages by name (paginated)")
    @GetMapping("/search")
    public ResponseEntity<Page<Language>> searchByLanguage(
            @RequestParam String name,
            Pageable pageable) {
        return ResponseEntity.ok(languageService.getLanguagesByName(name, pageable));
    }

    @Operation(summary = "Get all distinct language names")
    @GetMapping("/distinct")
    public ResponseEntity<List<String>> getDistinctLanguages() {
        return ResponseEntity.ok(languageService.getDistinctLanguages());
    }

    @Operation(summary = "Get language by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Language> getLanguageById(@PathVariable Long id) {
        return languageService.getLanguageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new language")
    @PostMapping
    public ResponseEntity<Language> createLanguage(@RequestBody Language language) {
        return ResponseEntity.status(201).body(languageService.saveLanguage(language));
    }

    @Operation(summary = "Delete language by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLanguage(@PathVariable Long id) {
        if (languageService.getLanguageById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        languageService.deleteLanguage(id);
        return ResponseEntity.ok().build();
    }
}

