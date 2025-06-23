package com.tweb.moviesProject.Actors;

import com.tweb.moviesProject.Movies.ActorRoleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActorService {
    private final ActorRepository actorRepository;

    @Autowired
    public ActorService(ActorRepository actorRepository) {
        this.actorRepository = actorRepository;
    }

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

    public List<ActorRoleDTO> getActorsByMovieId(Long movieId) {
        List<Object[]> actorData = actorRepository.findActorNamesAndRolesByMovieId(movieId);
        return actorData.stream()
                .map(data -> new ActorRoleDTO((String) data[0], (String) data[1]))
                .collect(Collectors.toList());
    }

    public List<Actor> findByNameContainingIgnoreCase(String name) {
        return actorRepository.findByNameContainingIgnoreCase(name);
    }

    public Page<Actor> findByNameContainingIgnoreCase(String name, Pageable pageable) {
        return actorRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    public List<String> findMovieNameByActorNameIgnoreCase(String name) {
        return actorRepository.findMovieNameByActorNameIgnoreCase(name);
    }

    public Actor findActorById(Long id) {
        return actorRepository.findActorById(id);
    }

    public List<String> getActorNamesByMovieId(Long movieId) {
        return getActorsByMovieId(movieId).stream()
                .map(ActorRoleDTO::getName)
                .collect(Collectors.toList());
    }

    // New method to get actor names by a list of movie IDs
    public Map<Long, List<String>> getActorNamesByMovieIds(List<Long> movieIds) {
        Map<Long, List<String>> result = new HashMap<>();
        for (Long movieId : movieIds) {
            result.put(movieId, getActorNamesByMovieId(movieId));
        }
        return result;
    }
}