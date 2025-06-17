package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Actors.Actor;
import com.tweb.moviesProject.Actors.ActorService;
import com.tweb.moviesProject.Genres.GenreService;
import com.tweb.moviesProject.Languages.Language;
import com.tweb.moviesProject.Languages.LanguageService;
import com.tweb.moviesProject.Posters.PosterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final PosterService posterService;
    private final GenreService genreService;
    private final ActorService actorService;
    private final LanguageService languageService;

    @Autowired
    public MovieService(MovieRepository movieRepository,
                        PosterService posterService,
                        GenreService genreService,
                        ActorService actorService,
                        LanguageService languageService) {
        this.movieRepository = movieRepository;
        this.posterService = posterService;
        this.genreService = genreService;
        this.actorService = actorService;
        this.languageService = languageService;
    }

    public Page<Movie> findByTitleIgnoreCase(String title, Pageable pageable) {
        return movieRepository.findByTitleIgnoreCase(title, pageable);
    }

    public Page<Movie> findByYear(Integer year, Pageable pageable) {
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
        // Extract movie IDs
        List<Integer> movieIds = moviePage.getContent().stream()
                .map(Movie::getMovieId)
                .toList();

        // Gets posters
        Map<Integer, String> posters = posterService.getPostersForMovies(movieIds);
        Map<Integer, List<String>> genresMap = new HashMap<>();
        Map<Integer, List<String>> languagesMap = new HashMap<>();
        Map<Integer, List<String>> actorsMap = new HashMap<>();

        // Gets genres for all movies
        for (Integer movieId : movieIds) {
            genresMap.put(movieId, genreService.getGenreNamesByMovieId(movieId));
            languagesMap.put(movieId, languageService.getLanguagesByMovieId(movieId)
                    .stream().map(Language::getLanguage).distinct().toList());
            actorsMap.put(movieId, actorService.getActorNamesByMovieId(movieId);
        }

        // Converts in DTO
        return moviePage.map(movie -> new MovieDTO(
                movie.getMovieId(),
                movie.getName(),
                movie.getDate(),
               // movie.getTagline(),
                movie.getDescription(),
                movie.getMinute(),
                // movie.getRating(),
                posters.getOrDefault(movie.getMovieId(), "default-poster.jpg"),
                genresMap.getOrDefault(movie.getMovieId(), List.of()),
                actorsMap.getOrDefault(movie.getMovieId(), List.of()),
                languagesMap.getOrDefault(movie.getMovieId(), List.of())
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

    public MovieDTO getMovieDetails(Integer movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() ->
                new NoSuchElementException("Movie with ID " + movieId + " not found"));

        String posterUrl = posterService.getPosterForMovie(movieId);
        List<String> genres = genreService.getGenreNamesByMovieId(movieId);
        List<String> actors = actorService.getActorNamesByMovieId(movieId);
        List<String> languages = languageService.getLanguagesByMovieId(movieId)
                .stream().map(Language::getLanguage).distinct().toList();

        return new MovieDTO(
                movie.getMovieId(),
                movie.getName(),
                movie.getDate(),
                // movie.getTagline(),
                movie.getDescription(),
                movie.getMinute(),
                // movie.getRating()
                posterUrl != null ? posterUrl : "default-poster.jpg",
                genres,
                actors,
                languages
        );
    }
}
