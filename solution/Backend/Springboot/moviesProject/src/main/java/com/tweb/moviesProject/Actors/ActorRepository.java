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

    @Query(value = "SELECT * FROM \"Actors\" ORDER BY random() LIMIT 1", nativeQuery = true)
    Actor findRandomActor();


}
