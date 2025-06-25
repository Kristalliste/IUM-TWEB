package com.tweb.moviesProject.Movies;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    @Query(value = "SELECT * FROM \"Movies\" m WHERE m.name ILIKE '%' || :title || '%' ORDER BY rating DESC NULLS LAST, id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m WHERE m.name ILIKE '%' || :title || '%'",
            nativeQuery = true)
    Page<Movie> findByTitleIgnoreCase(@Param("title") String title, Pageable pageable);

    @Query(value = "SELECT * FROM \"Movies\" m WHERE EXTRACT(YEAR FROM m.date) = :year ORDER BY rating DESC NULLS LAST, id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m WHERE EXTRACT(YEAR FROM m.date) = :year",
            nativeQuery = true)
    Page<Movie> findByYear(@Param("year") int year, Pageable pageable);

    @Query(value = "SELECT * FROM \"Movies\" m JOIN \"Genres\" g ON m.id = g.movie_id WHERE g.genre LIKE :genre ORDER BY rating DESC NULLS LAST, id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m JOIN \"Genres\" g ON m.id = g.movie_id WHERE g.genre LIKE :genre",
            nativeQuery = true)
    Page<Movie> findByGenreIgnoreCase(@Param("genre")String genre, Pageable pageable);

    // Add caching annotation to the single findAllMovies method
    @Cacheable("moviesCache")
    @Query(value = "SELECT * FROM \"Movies\"",
            countQuery = "SELECT count(*) FROM \"Movies\" ",
            nativeQuery = true)
    Page<Movie> findAllMovies(Pageable pageable);

    // Overriding the standard jpa function (otherwise it doesn't load details)
    @Override
    @Query(value = "SELECT * FROM \"Movies\" WHERE id = :id", nativeQuery = true)
    Optional<Movie> findById(@Param("id") Long id); //integer

    @Query(value = "SELECT * FROM \"Movies\" ORDER BY date DESC, rating DESC NULLS LAST, id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\"",
            nativeQuery = true)
    Page<Movie> findAllMoviesOrderedByDateDesc(Pageable pageable);

    @Query(value = "SELECT * FROM \"Movies\" WHERE rating IS NOT NULL ORDER BY rating DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" WHERE rating IS NOT NULL",
            nativeQuery = true)
    Page<Movie> findAllMoviesOrderedByRatingDesc(Pageable pageable);

    @Query(value = "SELECT * FROM \"Movies\" m JOIN \"Languages\" l ON m.id = l.movie_id WHERE l.language ILIKE '%' || :lang || '%' AND l.type LIKE 'Primary language' ORDER BY rating DESC NULLS LAST, id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m JOIN \"Languages\" l ON m.id = l.movie_id WHERE l.language ILIKE '%' || :lang || '%' AND l.type LIKE 'Primary language' ",
            nativeQuery = true)
    Page<Movie> findByLanguageIgnoreCase(@Param("lang")String language, Pageable pageable);

    @Query(value = "SELECT m.* FROM \"Movies\" m JOIN \"Actors\" a ON m.id = a.movie_id WHERE a.name ILIKE '%' || :actor || '%' ORDER BY rating DESC NULLS LAST, id DESC",
            countQuery = "SELECT count(*) FROM \"Movies\" m JOIN \"Actors\" a ON m.id = a.movie_id WHERE a.name ILIKE '%' || :actor || '%'",
            nativeQuery = true)
    Page<Movie> findByActorIgnoreCase(@Param("actor")String actor, Pageable pageable);
}
