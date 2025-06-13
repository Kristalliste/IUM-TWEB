package com.tweb.moviesProject.Actors;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActorRepository extends JpaRepository<Actor,Integer> {

    @Query(value = "SELECT * FROM \"Actors\" a WHERE a.name  ILIKE '%' || :nameStart || '%' LIMIT 1 ", nativeQuery = true)
    List<Actor> findByNameContainingIgnoreCase(@Param("nameStart") String name);

    @Query(value = "SELECT * FROM \"Actors\" ORDER BY random() LIMIT 1", nativeQuery = true)
    Actor findRandomActor();
}
