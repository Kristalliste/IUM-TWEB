package com.tweb.moviesProject.Languages;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LanguageService {

    private final LanguageRepository languageRepository;

    public LanguageService(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    public Page<Language> getAllLanguages(Pageable pageable) {
        return languageRepository.findAllLanguages(pageable);
    }

    public Page<Language> getLanguagesByMovieId(Long movieId, Pageable pageable) {
        return languageRepository.findByMovieId(movieId, pageable);
    }

    public Page<Language> getLanguagesByName(String name, Pageable pageable) {
        return languageRepository.findByLanguageName(name, pageable);
    }

    public List<String> getDistinctLanguages() {
        return languageRepository.findDistinctLanguages();
    }

    public Optional<Language> getLanguageById(Long id) {
        return languageRepository.findById(id);
    }

    public Language saveLanguage(Language language) {
        return languageRepository.save(language);
    }

    public void deleteLanguage(Long id) {
        languageRepository.deleteById(id);
    }
}
