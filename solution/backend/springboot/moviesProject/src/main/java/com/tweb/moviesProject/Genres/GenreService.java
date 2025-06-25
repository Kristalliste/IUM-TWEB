package com.tweb.moviesProject.Genres;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GenreService {

    // Repository for accessing genre data
    private final GenreRepository genreRepository;

    @Autowired
    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    // Batch method to get genre names by a list of movie IDs
    public Map<Long, List<String>> getGenreNamesByMovieIds(List<Long> movieIds) {
        if (movieIds == null || movieIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Long, List<String>> result = new HashMap<>();
        for (Long movieId : movieIds) {
            // For each movie ID, retrieve the list of genre names
            result.put(movieId, genreRepository.findGenreNamesByMovieId(movieId));
        }
        return result;
    }

    // Retrieve all distinct genre names
    public List<String> getAllGenres() {
        return genreRepository.findDistinctGenres();
    }

    // Retrieve all Genre objects for a specific movie ID
    public List<Genre> getGenresByMovieId(Long movieId) {
        return genreRepository.findByMovieId(movieId);
    }

    // Retrieve genre names for a specific movie ID
    public List<String> getGenreNamesByMovieId(Long movieId) {
        return genreRepository.findGenreNamesByMovieId(movieId);
    }

    // Retrieve all Genre objects by genre name
    public List<Genre> getGenresByName(String genreName) {
        return genreRepository.findByGenreName(genreName);
    }
}