package com.tweb.moviesProject.Languages;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {

    @Query(value = "SELECT * FROM \"Languages\"",
            countQuery = "SELECT count(*) FROM \"Languages\"",
            nativeQuery = true)
    Page<Language> findAllLanguages(Pageable pageable);

    @Query(value = "SELECT * FROM \"Languages\" WHERE movie_id = :movieId",
            countQuery = "SELECT count(*) FROM \"Languages\" WHERE movie_id = :movieId",
            nativeQuery = true)
    Page<Language> findByMovieId(@Param("movieId") Long movieId, Pageable pageable);

    @Query(value = "SELECT * FROM \"Languages\" WHERE LOWER(language) LIKE LOWER(CONCAT('%', :language, '%'))",
            countQuery = "SELECT count(*) FROM \"Languages\" WHERE LOWER(language) LIKE LOWER(CONCAT('%', :language, '%'))",
            nativeQuery = true)
    Page<Language> findByLanguageName(@Param("language") String language, Pageable pageable);

    @Query(value = "SELECT DISTINCT language FROM \"Languages\"", nativeQuery = true)
    List<String> findDistinctLanguages();
}
