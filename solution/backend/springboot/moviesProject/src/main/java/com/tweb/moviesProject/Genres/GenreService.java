package com.tweb.moviesProject.Genres;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GenreService {

    private final GenreRepository genreRepository;

    @Autowired
    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    // Batch method to get genre names by movie IDs
    public Map<Long, List<String>> getGenreNamesByMovieIds(List<Long> movieIds) {
        if (movieIds == null || movieIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Long, List<String>> result = new HashMap<>();
        for (Long movieId : movieIds) {
            result.put(movieId, genreRepository.findGenreNamesByMovieId(movieId));
        }
        return result;
    }

    public List<Genre> getGenresByMovieId(Long movieId) {
        return genreRepository.findByMovieId(movieId);
    }

    public List<String> getGenreNamesByMovieId(Long movieId) {
        return genreRepository.findGenreNamesByMovieId(movieId);
    }

    public List<Genre> getGenresByName(String genreName) {
        return genreRepository.findByGenreName(genreName);
    }
}
