package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Actors.ActorService;
import com.tweb.moviesProject.Genres.GenreService;
import com.tweb.moviesProject.Languages.Language;
import com.tweb.moviesProject.Languages.LanguageService;
import com.tweb.moviesProject.Posters.PosterService;
import com.tweb.moviesProject.OscarAwards.OscarAwardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Tag(name = "Movie Service", description = "Service layer for movie data and DTO conversion")
public class MovieService {

    private final MovieRepository movieRepository;
    private final PosterService posterService;
    private final GenreService genreService;
    private final ActorService actorService;
    private final LanguageService languageService;
    private final OscarAwardService oscarAwardService;

    @Autowired
    public MovieService(MovieRepository movieRepository,
                        PosterService posterService,
                        GenreService genreService,
                        ActorService actorService,
                        LanguageService languageService,
                        OscarAwardService oscarAwardService) {
        this.movieRepository = movieRepository;
        this.posterService = posterService;
        this.genreService = genreService;
        this.actorService = actorService;
        this.languageService = languageService;
        this.oscarAwardService = oscarAwardService;
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

    /**
     * Converts a Page of Movie entities to a Page of MovieDTOs
     */
    private Page<MovieDTO> convertToDTOPage(Page<Movie> moviePage) {
        // Extract movie IDs
        List<Integer> movieIds = moviePage.getContent().stream()
                .map(Movie::getMovieId)
                .toList();

        // Extract movie names for hasOscsr
        List<String> movieNames = moviePage.getContent().stream()
                .map(Movie::getName)
                .toList();

        // Gets posters - no exception thrown, defaults handled inside PosterService
        Map<Integer, String> posters = posterService.getPostersByMovieIds(movieIds);
        Map<Integer, List<String>> genresMap = new HashMap<>();
        Map<Integer, List<String>> languagesMap = new HashMap<>();
        Map<Integer, List<String>> actorsMap = new HashMap<>();

        // Gets genres, languages, actors for all movies
        for (Integer movieId : movieIds) {
            genresMap.put(movieId, genreService.getGenreNamesByMovieId(movieId));
            languagesMap.put(movieId, languageService.getLanguagesByMovieId(movieId)
                    .stream().map(Language::getLanguage).distinct().toList());
            actorsMap.put(movieId, actorService.getActorNamesByMovieId(movieId));
        }

        // Batch method
        Map<String, Boolean> oscarMap = oscarAwardService.hasOscarBatch(movieNames);

        // Converts in DTO
        return moviePage.map(movie -> new MovieDTO(
                movie.getMovieId(),
                movie.getName(),
                movie.getDate(),
                movie.getDescription(),
                movie.getMinute(),
                movie.getRating(), // <-- Aggiungi questa linea
                posters.getOrDefault(movie.getMovieId(), "default-poster.jpg"),
                genresMap.getOrDefault(movie.getMovieId(), List.of()),
                actorsMap.getOrDefault(movie.getMovieId(), List.of()),
                languagesMap.getOrDefault(movie.getMovieId(), List.of()),
                oscarMap.getOrDefault(movie.getName(), false)
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

        String posterUrl = posterService.getPosterByMovieId(movieId); // also no exception thrown here
        List<String> genres = genreService.getGenreNamesByMovieId(movieId);
        List<String> actors = actorService.getActorNamesByMovieId(movieId);
        //List<Review> reviews = reviewRepository.findByMovieId(movieId);
        List<String> languages = languageService.getLanguagesByMovieId(movieId)
                .stream().map(Language::getLanguage).distinct().toList();

        boolean hasOscar = oscarAwardService.hasOscar(movie.getName());

        return new MovieDTO(
                movie.getMovieId(),
                movie.getName(),
                movie.getDate(),
                // movie.getTagline(),
                movie.getDescription(),
                movie.getMinute(),
                movie.getRating(),
                posterUrl != null ? posterUrl : "default-poster.jpg",
                genres,
                actors,
                languages,
                hasOscar
                //reviews.stream().map(review ->new ReviewDTO(review.getUser(), review.getComment())).collect(Collectors.toList())
        );
    }
}
