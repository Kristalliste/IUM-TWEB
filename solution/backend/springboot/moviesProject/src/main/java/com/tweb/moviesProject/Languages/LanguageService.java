package com.tweb.moviesProject.Languages;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Service layer for managing language-related business logic.
 */
@Service
public class LanguageService {

    private final LanguageRepository languageRepository;

    /**
     * Constructs a LanguageService with the given repository.
     */
    public LanguageService(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    /**
     * Retrieves a list of languages associated with a specific movie ID.
     * Returns an empty list if no languages are found.
     */
    public List<Language> getLanguagesByMovieId(Integer movieId) {
        List<Language> languages = languageRepository.findByMovieId(movieId);
        if (languages.isEmpty()) {
            // return empty list instead of throwing exception
            return Collections.emptyList();
        }
        return languages;
    }
}
