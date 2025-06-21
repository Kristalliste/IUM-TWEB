package com.tweb.moviesProject.Posters;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PosterRepository extends JpaRepository<Poster, Long> {

    @Query(value = "SELECT link FROM \"Posters\" WHERE movie_id = :movieId LIMIT 1", nativeQuery = true)
    String findPosterLinkByMovieId(@Param("movieId") Long movieId);

    }