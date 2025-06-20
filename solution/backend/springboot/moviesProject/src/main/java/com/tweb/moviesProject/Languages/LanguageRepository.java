package com.tweb.moviesProject.Languages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {

    @Query(value = "SELECT l.language FROM \"Languages\" l WHERE l.movie_id = :movieId", nativeQuery = true)
    List<String> findLanguageNamesByMovieId(@Param("movieId") Long movieId);

    List<Language> findByMovieId(Long movieId);
}
