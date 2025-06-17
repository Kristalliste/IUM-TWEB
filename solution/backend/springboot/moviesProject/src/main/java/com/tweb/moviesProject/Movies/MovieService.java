package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Actors.ActorService;
import com.tweb.moviesProject.Posters.PosterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MovieService {

    private MovieRepository  movieRepository;
    private final PosterService posterService; // Nuovo servizio

    @Autowired
    public MovieService(MovieRepository movieRepository, PosterService posterService) {
        this.movieRepository = movieRepository;
        this.posterService = posterService;
    }

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

    private Page<MovieDTO> convertToDTOPage(Page<Movie> moviePage) {
        // Estrai gli ID dei film
        List<Integer> movieIds = moviePage.getContent().stream()
                .map(Movie::getMovieId)
                .toList();

        System.out.println("Movie IDs: " + movieIds);

        // Recupera i poster
        Map<Integer, String> posters = posterService.getPostersForMovies(movieIds);
        System.out.println("Posters trovati: " + posters.size());

        // Converti in DTO con poster
        return moviePage.map(movie -> new MovieDTO(
                movie.getMovieId(),
                movie.getTitle(),
                movie.getDate(),
                movie.getTagline(),
                movie.getDescription(),
                movie.getMinute(),
                movie.getRating(),
                posters.getOrDefault(movie.getMovieId(), "default-poster.jpg") // Poster di default
        ));
    }

    public Page<MovieDTO> findByTitleIgnoreCaseDTO(String title, Pageable pageable) {
        return convertToDTOPage(movieRepository.findByTitleIgnoreCase(title, pageable));
    }

    public Page<MovieDTO> findByYearDTO(Integer year, Pageable pageable) {
        return convertToDTOPage(movieRepository.findByYear(year, pageable));
    }

    public Page<MovieDTO> findByGenreIgnoreCaseDTO(String genre, Pageable pageable) {
        return convertToDTOPage(movieRepository.findByGenreIgnoreCase(genre, pageable));
    }

    public Page<MovieDTO> getAllMoviesDTO(Pageable pageable) {
        return convertToDTOPage(movieRepository.findAllMovies(pageable));
    }
}
