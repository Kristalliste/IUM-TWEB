package com.tweb.moviesProject.Actors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActorService {

    private final ActorRepository actorRepository;

    @Autowired
    public ActorService(ActorRepository actorRepository) {
        this.actorRepository = actorRepository;
    }

    // Add this new method
    public Map<Long, List<String>> getActorNamesByMovieIds(List<Long> movieIds) {
        if (movieIds == null || movieIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Long, List<String>> result = new HashMap<>();
        for (Long movieId : movieIds) {
            result.put(movieId, actorRepository.findActorNamesByMovieId(movieId));
        }
        return result;
    }

    // Existing methods remain unchanged
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
        List<String> names = actorRepository.findActorNamesByMovieId(movieId);
        if (names == null) {
            return Collections.emptyList();
        }
        return names;
    }
}