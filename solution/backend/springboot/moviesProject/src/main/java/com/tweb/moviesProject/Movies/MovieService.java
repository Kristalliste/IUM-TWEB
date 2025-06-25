package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Actors.ActorRoleDTO;
import com.tweb.moviesProject.Actors.ActorService;
import com.tweb.moviesProject.Genres.GenreService;
import com.tweb.moviesProject.Languages.LanguageService;
import com.tweb.moviesProject.Posters.PosterService;
import com.tweb.moviesProject.OscarAwards.OscarAwardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Tag(name = "Movie Service", description = "Service layer for movie data and DTO conversion")
public class MovieService {

    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);

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
/*
    public Page<Movie> findByTitleIgnoreCase(String title, Pageable pageable) {
        return movieRepository.findByTitleIgnoreCase(title, pageable);
    }

    public Page<Movie> findByYear(Integer year, Pageable pageable) {
        return movieRepository.findByYear(year, pageable);
    }

    public Page<Movie> findByGenreIgnoreCase(String genre, Pageable pageable) {
        return movieRepository.findByGenreIgnoreCase(genre, pageable);
    }

    public Page<Movie> getAllMovies(Pageable pageable) {
        return movieRepository.findAllMovies(pageable);
    }
 */

    // Batch method to get posters by movie IDs
    public Map<Long, String> getPostersByMovieIds(List<Long> movieIds) {
        return posterService.getPostersByMovieIds(movieIds);
    }

    // Converts a Page of Movie entities to a Page of MovieDTOs
    private Page<MovieDTO> convertToDTOPage(Page<Movie> moviePage) {
        // Get all movie IDs
        List<Long> movieIds = moviePage.getContent().stream()
                .map(Movie::getMovieId)
                .collect(Collectors.toList());

        // Batch fetch all related data
        Map<Long, String> posters = getPostersByMovieIds(movieIds);
        Map<Long, List<String>> genresMap = genreService.getGenreNamesByMovieIds(movieIds);
        Map<Long, List<ActorRoleDTO>> actorsMap = actorService.getActorsByMovieIds(movieIds);
        Map<Long, List<String>> languagesMap = languageService.getLanguageNamesByMovieIds(movieIds);

        // Get movie names for Oscar check
        List<String> movieNames = moviePage.getContent().stream()
                .map(Movie::getName)
                .collect(Collectors.toList());
        Map<String, Boolean> oscarMap = oscarAwardService.hasOscarBatch(movieNames);

        return moviePage.map(movie -> {
            Long movieId = movie.getMovieId();
            return new MovieDTO(
                    movieId,
                    movie.getName(),
                    movie.getDate(),
                    movie.getDescription(),
                    movie.getMinute(),
                    movie.getRating(),
                    posters.getOrDefault(movieId, "https://placehold.co/300x450?text=No+Image"),
                    genresMap.getOrDefault(movieId, Collections.emptyList()),
                    actorsMap.getOrDefault(movieId, Collections.emptyList()), // This now correctly passes List<ActorRoleDTO>
                    languagesMap.getOrDefault(movieId, Collections.emptyList()),
                    oscarMap.getOrDefault(movie.getName(), false)
            );
        });
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

    public Page<MovieDTO> findByLanguageIgnoreCaseDTO(String language, Pageable pageable) {
        return convertToDTOPage(movieRepository.findByLanguageIgnoreCase(language, pageable));
    }

    public Page<MovieDTO> getAllMoviesDTO(Pageable pageable) {
        return convertToDTOPage(movieRepository.findAllMovies(pageable));
    }

    public MovieDTO getMovieDetails(Long movieId) {
        logger.debug("Fetching details for movie: {}", movieId);

        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> {
            throw new EntityNotFoundException("Movie with id " + movieId + " doesn't exist");
        });
        try {
            String posterUrl = posterService.getPosterByMovieId(movieId);
            List<String> genres = genreService.getGenreNamesByMovieId(movieId);
            List<ActorRoleDTO> actors = actorService.getActorsByMovieId(movieId);
            List<String> languages = languageService.getLanguageNamesByMovieId(movieId);

            boolean hasOscar = oscarAwardService.hasOscar(movie.getName());

            return new MovieDTO(
                    movie.getMovieId(),
                    movie.getName(),
                    movie.getDate(),
                    movie.getDescription(),
                    movie.getMinute(),
                    movie.getRating(),
                    posterUrl != null ? posterUrl : "https://placehold.co/300x450?text=No+Image",
                    genres,
                    actors,
                    languages,
                    hasOscar
            );
        } catch (Exception e) {
            logger.error("Error building MovieDTO", e);
            throw e; // Global handler will catch this
        }
    }

    public Page<MovieDTO> getAllMoviesOrderedByDateDescDTO(Pageable pageable) {
        return convertToDTOPage(movieRepository.findAllMoviesOrderedByDateDesc(pageable));
    }

    public Page<MovieDTO> getAllMoviesOrderedByRatingDescDTO(Pageable pageable) {
        return convertToDTOPage(movieRepository.findAllMoviesOrderedByRatingDesc(pageable));
    }

    public Page<MovieDTO> findByActorIgnoreCase(String actor, Pageable pageable) {
        return convertToDTOPage(movieRepository.findByActorIgnoreCase(actor, pageable));
    }
}