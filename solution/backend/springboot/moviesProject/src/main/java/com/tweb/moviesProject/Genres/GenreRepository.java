package com.tweb.moviesProject.Genres;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Integer> {

    @Query(value = "SELECT * FROM \"Genres\" WHERE movie_id = :movieId", nativeQuery = true)
    List<Genre> findByMovieId(@Param("movieId") Integer movieId);

    @Query(value = "SELECT genre FROM \"Genres\" WHERE movie_id = :movieId", nativeQuery = true)
    List<String> findGenreNamesByMovieId(@Param("movieId") Integer movieId);

    @Query(value = "SELECT * FROM \"Genres\" WHERE genre ILIKE :genre", nativeQuery = true)
    List<Genre> findByGenreName(@Param("genre") String genre);
}
