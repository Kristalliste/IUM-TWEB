package com.tweb.moviesProject.Movies;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {

    @Query(value = "SELECT * FROM \"Movies\" m WHERE m.name ILIKE '%' || :title || '%'",
            countQuery = "SELECT count(*) FROM \"Movies\" m WHERE m.name ILIKE '%' || :title || '%'",
            nativeQuery = true)
    Page<Movie> findByTitleIgnoreCase(@Param("title") String title, Pageable pageable);

    @Query(value = "SELECT * FROM \"Movies\" m WHERE m.date = :year || '%'",
            countQuery = "SELECT count(*) FROM \"Movies\" m WHERE m.date = :title || '%'",
            nativeQuery = true)
    Page<Movie> findByYear(@Param("year") int year, Pageable pageable);
}
