package com.tweb.moviesProject.Actors;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActorRepository extends JpaRepository<Actor,Integer> {

    @Query(value = "SELECT * FROM \"Actors\" a WHERE a.name  ILIKE '%' || :nameStart || '%' LIMIT 1 ", nativeQuery = true)
    List<Actor> findByNameContainingIgnoreCase(@Param("nameStart") String name);


    @Query(value = "SELECT DISTINCT ON (a.name) * FROM \"Actors\" a WHERE a.name ILIKE '%' || :nameStart || '%'",
            countQuery = "SELECT count(*) FROM \"Actors\" a WHERE a.name ILIKE '%' || :nameStart || '%'",
            nativeQuery = true)
    Page<Actor> findByNameContainingIgnoreCase(@Param("nameStart") String nameStart, Pageable pageable);

    @Query(value = "SELECT DISTINCT m.name FROM \"Actors\" a JOIN \"Movies\" m ON a.movie_id = m.id WHERE a.name ILIKE :name ", nativeQuery = true)
    List<String> findMovieNameByActorNameIgnoreCase(@Param("name") String name);

    @Query(value = "SELECT * FROM \"Actors\" a WHERE a.actor_id = :id", nativeQuery = true)
    Actor findActorById(@Param("id") Integer id);
}
