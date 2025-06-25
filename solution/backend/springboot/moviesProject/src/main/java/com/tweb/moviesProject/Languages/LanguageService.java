package com.tweb.moviesProject.Languages;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LanguageService {

    // Repository for accessing language data from the database
    private final LanguageRepository languageRepository;

    @Autowired
    public LanguageService(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }
/*
// Returns all Language entities associated with a specific movie ID
    public List<Language> getLanguagesByMovieId(Long movieId) {
        return languageRepository.findByMovieId(movieId);
    }*/

    // Returns the names of languages for a specific movie ID
    public List<String> getLanguageNamesByMovieId(Long movieId) {
        return languageRepository.findLanguageNamesByMovieId(movieId);
    }

    // Returns a map where each movie ID is associated with a list of language names
    public Map<Long, List<String>> getLanguageNamesByMovieIds(List<Long> movieIds) {
        if (movieIds == null || movieIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Long, List<String>> result = new HashMap<>();
        for (Long movieId : movieIds) {
            // For each movie ID, fetch the corresponding language names
            result.put(movieId, languageRepository.findLanguageNamesByMovieId(movieId));
        }
        return result;
    }

    // Returns all Language entities matching the given language name
    public List<Language> getLanguagesByName(String languageName) {
        return languageRepository.findByLanguageName(languageName);
    }
}
