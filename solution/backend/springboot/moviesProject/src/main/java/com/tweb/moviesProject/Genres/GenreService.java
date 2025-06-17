package com.tweb.moviesProject.Genres;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreService {

    private final GenreRepository genreRepository;

    @Autowired
    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public List<Genre> getGenresByMovieId(Integer movieId) {
        return genreRepository.findByMovieId(movieId);
    }

    public List<String> getGenreNamesByMovieId(Integer movieId) {
        return genreRepository.findGenreNamesByMovieId(movieId);
    }

    public List<Genre> getGenresByName(String genreName) {
        return genreRepository.findByGenreName(genreName);
    }
}
