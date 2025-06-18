package com.tweb.moviesProject.OscarAwards;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for accessing OscarAward entities.
 * Provides methods to check existence of films and find films from a list.
 */
@Repository
public interface OscarAwardRepository extends JpaRepository<OscarAward, Integer> {

    /**
     * Checks if a film exists in the OscarAwards table, case-insensitive.
     */
    @Query(value = "SELECT EXISTS (SELECT 1 FROM \"OscarAwards\" WHERE LOWER(film) = LOWER(:film))", nativeQuery = true)
    boolean existsByFilm(@Param("film") String film);

    /**
     * Finds all film titles from the given list that exist in the OscarAwards table.
     */
    @Query("SELECT o.film FROM OscarAward o WHERE o.film IN :films")
    List<String> findFilmsInList(@Param("films") List<String> films);
}
