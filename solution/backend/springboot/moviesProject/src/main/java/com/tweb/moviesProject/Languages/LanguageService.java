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
/*
    public List<Language> getLanguagesByMovieId(Long movieId) {
        return languageRepository.findByMovieId(movieId);
    }*/

    public List<String> getLanguageNamesByMovieId(Long movieId) {
        return languageRepository.findLanguageNamesByMovieId(movieId);
    }

    // Batch method to get language names by movie IDs
    public Map<Long, List<String>> getLanguageNamesByMovieIds(List<Long> movieIds) {
        if (movieIds == null || movieIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Long, List<String>> result = new HashMap<>();
        for (Long movieId : movieIds) {
            result.put(movieId, languageRepository.findLanguageNamesByMovieId(movieId));
        }
        return result;
    }

    public List<Language> getLanguagesByName(String languageName) {
        return languageRepository.findByLanguageName(languageName);
    }
}
