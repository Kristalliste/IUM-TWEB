package com.tweb.moviesProject.Languages;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LanguageService {

    private final LanguageRepository languageRepository;

    @Autowired
    public LanguageService(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    // Add this new method
    public Map<Integer, List<String>> getLanguageNamesByMovieIds(List<Integer> movieIds) {
        if (movieIds == null || movieIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Integer, List<String>> result = new HashMap<>();
        for (Integer movieId : movieIds) {
            result.put(movieId, languageRepository.findLanguageNamesByMovieId(movieId));
        }
        return result;
    }

    // Existing methods remain unchanged
    public List<Language> getLanguagesByMovieId(Integer movieId) {
        List<Language> languages = languageRepository.findByMovieId(movieId);
        if (languages.isEmpty()) {
            return Collections.emptyList();
        }
        return languages;
    }
}
