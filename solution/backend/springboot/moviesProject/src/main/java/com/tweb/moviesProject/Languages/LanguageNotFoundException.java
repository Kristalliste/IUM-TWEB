package com.tweb.moviesProject.Languages;

public class LanguageNotFoundException extends RuntimeException {
    public LanguageNotFoundException(Integer movieId) {
        super("No languages found for movie with ID: " + movieId);
    }
}
