package com.tweb.moviesProject.Genres;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

    // Returns a list of genre names for a given movie ID
    @Query(value = "SELECT genre FROM \"Genres\" WHERE movie_id = :movieId", nativeQuery = true)
    List<String> findGenreNamesByMovieId(@Param("movieId") Long movieId);

    // Returns a list of Genre entities for a given movie ID
    @Query(value = "SELECT * FROM \"Genres\" WHERE movie_id = :movieId", nativeQuery = true)
    List<Genre> findByMovieId(@Param("movieId") Long movieId);

    // Returns a list of Genre entities matching the given genre name (case-insensitive)
    @Query(value = "SELECT * FROM \"Genres\" WHERE genre ILIKE :genre", nativeQuery = true)
    List<Genre> findByGenreName(@Param("genre") String genre);

    // Returns a list of all distinct genre names
    @Query(value = "SELECT DISTINCT g.genre FROM \"Genres\" g", nativeQuery = true)
    List<String> findDistinctGenres();
}