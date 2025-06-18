package com.tweb.moviesProject.Languages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for accessing Language entities from the database.
 */
@Repository
public interface LanguageRepository extends JpaRepository<Language, Integer> {
    /**
     * Finds all languages associated with the specified movie ID.
     */
    List<Language> findByMovieId(Integer movieId);
}
