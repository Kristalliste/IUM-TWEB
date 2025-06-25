package com.tweb.moviesProject.Actors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActorService {
    // Repository for accessing actor data from the database
    private final ActorRepository actorRepository;

    @Autowired
    public ActorService(ActorRepository actorRepository) {
        this.actorRepository = actorRepository;
    }

    /**
     * Retrieves a map of movie IDs to lists of ActorRoleDTOs for the given movie IDs.
     * @param movieIds List of movie IDs
     * @return Map where key is movie ID and value is list of ActorRoleDTOs
     */
    public Map<Long, List<ActorRoleDTO>> getActorsByMovieIds(List<Long> movieIds) {
        if (movieIds == null || movieIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Long, List<ActorRoleDTO>> result = new HashMap<>();
        for (Long movieId : movieIds) {
            result.put(movieId, getActorsByMovieId(movieId));
        }
        return result;
    }

    /**
     * Retrieves a list of ActorRoleDTOs for a specific movie ID.
     * @param movieId Movie ID
     * @return List of ActorRoleDTOs
     */
    public List<ActorRoleDTO> getActorsByMovieId(Long movieId) {
        List<Object[]> actorData = actorRepository.findActorNamesAndRolesByMovieId(movieId);
        return actorData.stream()
                .map(data -> new ActorRoleDTO((String) data[0], (String) data[1]))
                .collect(Collectors.toList());
    }

    /**
     * Finds actors whose names contain the given string, case-insensitive.
     * @param name Name fragment
     * @return List of matching Actor entities
     */
    public List<Actor> findByNameContainingIgnoreCase(String name) {
        return actorRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Finds actors whose names contain the given string, case-insensitive, with pagination.
     * @param name Name fragment
     * @param pageable Pageable object for pagination
     * @return Page of matching Actor entities
     */
    public Page<Actor> findByNameContainingIgnoreCase(String name, Pageable pageable) {
        return actorRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    /**
     * Retrieves the names of movies in which an actor with the given name appears.
     * @param name Actor name
     * @return List of movie names
     */
    public List<String> findMovieNameByActorNameIgnoreCase(String name) {
        return actorRepository.findMovieNameByActorNameIgnoreCase(name);
    }

    /**
     * Finds an actor by their unique ID.
     * @param id Actor ID
     * @return Actor entity or null if not found
     */
    public Actor findActorById(Long id) {
        return actorRepository.findActorById(id);
    }

    /**
     * Retrieves the names of actors for a specific movie ID.
     * @param movieId Movie ID
     * @return List of actor names
     */
    public List<String> getActorNamesByMovieId(Long movieId) {
        return getActorsByMovieId(movieId).stream()
                .map(ActorRoleDTO::getName)
                .collect(Collectors.toList());
    }
}