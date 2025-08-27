package com.tweb.moviesProject.Movies;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    // Search movies by title (case-insensitive), ordered by rating and id
    @Query(value = "SELECT * FROM \"Movies\" m WHERE m.name ILIKE '%' || :title || '%' ORDER BY m.rating DESC NULLS LAST, m.id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m WHERE m.name ILIKE '%' || :title || '%'",
            nativeQuery = true)
    Page<Movie> findByTitleIgnoreCase(@Param("title") String title, Pageable pageable);

    // Search movies by year, ordered by rating and id
    @Query(value = "SELECT * FROM \"Movies\" m WHERE EXTRACT(YEAR FROM m.date) = :year ORDER BY m.rating DESC NULLS LAST, m.id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m WHERE EXTRACT(YEAR FROM m.date) = :year",
            nativeQuery = true)
    Page<Movie> findByYear(@Param("year") int year, Pageable pageable);

    // Search movies by genre, ordered by rating and id
    @Query(value = "SELECT m.* FROM \"Movies\" m JOIN \"Genres\" g ON m.id = g.movie_id WHERE g.genre ILIKE '%' || :genre || '%' ORDER BY m.rating DESC NULLS LAST, m.id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m JOIN \"Genres\" g ON m.id = g.movie_id WHERE g.genre ILIKE '%' || :genre || '%'",
            nativeQuery = true)
    Page<Movie> findByGenreIgnoreCase(@Param("genre")String genre, Pageable pageable);

    // Get all movies with explicit ordering
    @Query(value = "SELECT * FROM \"Movies\" m ORDER BY m.rating DESC NULLS LAST, m.id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\"",
            nativeQuery = true)
    Page<Movie> findAllMovies(Pageable pageable);

    // Override findById to use a custom query (to load details)
    @Override
    @Query(value = "SELECT * FROM \"Movies\" WHERE id = :id", nativeQuery = true)
    Optional<Movie> findById(@Param("id") Long id);

    // Get all movies ordered by date, rating, and id
    @Query(value = "SELECT * FROM \"Movies\" m ORDER BY m.date DESC, m.rating DESC NULLS LAST, m.id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\"",
            nativeQuery = true)
    Page<Movie> findAllMoviesOrderedByDateDesc(Pageable pageable);

    // Get all movies with a rating, ordered by rating
    @Query(value = "SELECT * FROM \"Movies\" m WHERE m.rating IS NOT NULL ORDER BY m.rating DESC, m.id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" WHERE rating IS NOT NULL",
            nativeQuery = true)
    Page<Movie> findAllMoviesOrderedByRatingDesc(Pageable pageable);

    // Search movies by primary language (case-insensitive), ordered by rating and id
    @Query(value = "SELECT m.* FROM \"Movies\" m JOIN \"Languages\" l ON m.id = l.movie_id WHERE l.language ILIKE '%' || :lang || '%' AND l.type LIKE 'Primary language' ORDER BY m.rating DESC NULLS LAST, m.id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m JOIN \"Languages\" l ON m.id = l.movie_id WHERE l.language ILIKE '%' || :lang || '%' AND l.type LIKE 'Primary language'",
            nativeQuery = true)
    Page<Movie> findByLanguageIgnoreCase(@Param("lang")String language, Pageable pageable);

    // Search movies by actor name (case-insensitive), ordered by rating and id
    @Query(value = "SELECT m.* FROM \"Movies\" m JOIN \"Actors\" a ON m.id = a.movie_id WHERE a.name ILIKE '%' || :actor || '%' ORDER BY m.rating DESC NULLS LAST, m.id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m JOIN \"Actors\" a ON m.id = a.movie_id WHERE a.name ILIKE '%' || :actor || '%'",
            nativeQuery = true)
    Page<Movie> findByActorIgnoreCase(@Param("actor")String actor, Pageable pageable);
}