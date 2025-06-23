package com.tweb.moviesProject.Languages;

import com.tweb.moviesProject.Genres.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {

    @Query(value = "SELECT language FROM \"Languages\" WHERE movie_id = :movieId", nativeQuery = true)
    List<String> findLanguageNamesByMovieId(@Param("movieId") Long movieId);

    @Query(value = "SELECT * FROM \"Languages\" WHERE movie_id = :movieId", nativeQuery = true)
    List<Language> findByMovieId(Long movieId);

    @Query(value = "SELECT * FROM \"Languages\" WHERE genre ILIKE :language", nativeQuery = true)
    List<Language> findByLanguageName(@Param("language") String genre);

}
