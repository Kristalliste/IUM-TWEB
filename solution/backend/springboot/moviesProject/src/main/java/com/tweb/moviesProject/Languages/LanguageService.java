package com.tweb.moviesProject.Languages;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LanguageService {

    private final LanguageRepository languageRepository;

    public LanguageService(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    public List<Language> getLanguagesByMovieId(Integer movieId) {
        List<Language> languages = languageRepository.findByMovieId(movieId);
        if (languages.isEmpty()) {
            throw new LanguageNotFoundException(movieId);
        }
        return languages;
    }
}
