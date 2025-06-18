package com.tweb.moviesProject.Movies;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {

    @Query(value = "SELECT * FROM \"Movies\" m WHERE m.name ILIKE '%' || :title || '%'",
            countQuery = "SELECT count(*) FROM \"Movies\" m WHERE m.name ILIKE '%' || :title || '%'",
            nativeQuery = true)
    Page<Movie> findByTitleIgnoreCase(@Param("title") String title, Pageable pageable);

    @Query(value = "SELECT * FROM \"Movies\" m WHERE EXTRACT(YEAR FROM m.date) = :year",
            countQuery = "SELECT count(*) FROM \"Movies\" m WHERE EXTRACT(YEAR FROM m.date) = :year",
            nativeQuery = true)
    Page<Movie> findByYear(@Param("year") int year, Pageable pageable);

    @Query(value = "SELECT * FROM \"Movies\" m JOIN \"Genres\" g ON m.id = g.movie_id WHERE g.genre LIKE :genre",
            countQuery = "SELECT count(*) FROM \"Movies\" m JOIN \"Genres\" g ON m.id = g.movie_id WHERE g.genre LIKE :genre",
            nativeQuery = true)
    Page<Movie> findByGenreIgnoreCase(@Param("genre")String genre, Pageable pageable);

    @Query(value = "SELECT DISTINCT g.genre FROM \"Genres\" g", nativeQuery = true)
    List<String> findDistinctGenres();

    @Query(value = "SELECT * FROM \"Movies\"",
            countQuery = "SELECT count(*) FROM \"Movies\" ",
            nativeQuery = true)
    Page<Movie> findAllMovies(Pageable pageable);

}