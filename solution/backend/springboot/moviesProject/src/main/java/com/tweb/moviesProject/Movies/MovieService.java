package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Actors.ActorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository  movieRepository;

    public MovieService(MovieRepository movieRepository) {this.movieRepository = movieRepository;}

    public Page<Movie> findByTitleIgnoreCase(String title, Pageable pageable) {
        return movieRepository.findByTitleIgnoreCase(title, pageable);
    }

    public Page<Movie> findByYear( Integer year, Pageable pageable) {
        return movieRepository.findByYear(year, pageable);
    }

    public Page<Movie> findByGenreIgnoreCase(String genre, Pageable pageable) {
        return movieRepository.findByGenreIgnoreCase(genre, pageable);
    }

    public List<String> getAllGenres() {
        return movieRepository.findDistinctGenres();
    }

    public Page<Movie> getAllMovies(Pageable pageable) {
        return movieRepository.findAllMovies(pageable);
    }
}
