package com.tweb.moviesProject.Actors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.QPageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActorService {

    @Autowired
    private ActorRepository actorRepository;

    public ActorService (ActorRepository actorRepository) {this.actorRepository = actorRepository;}

    public List<Actor> findByNameContainingIgnoreCase(String name) {
        return actorRepository.findByNameContainingIgnoreCase(name);
    }

   public Page<Actor> findByNameContainingIgnoreCase(String name, Pageable pageable){
        return  actorRepository.findByNameContainingIgnoreCase(name, pageable);
   }

    public List<String> findMovieNameByActorNameIgnoreCase(String name) {
        return actorRepository.findMovieNameByActorNameIgnoreCase(name);
    }

   /* public Actor findActorById(Integer id){
        Actor actor = actorRepository.findActorById(id);
        if (actor == null) {
            throw new ActorNotFoundException("Actor with ID " + id + " not found.");
        }
        return actor;
    }

    public List<String> getActorNamesByMovieId(Integer movieId) {
        List<String> names = actorRepository.findActorNamesByMovieId(movieId);
        if (names.isEmpty()) {
            throw new ActorNotFoundException("No actors found for movie " + movieId);
        }
        return names;
    }*/

   public Actor findActorById(Integer id) {
       Actor actor = actorRepository.findActorById(id);
       return actor; // could be null if not found
   }

    public List<String> getActorNamesByMovieId(Integer movieId) {
        List<String> names = actorRepository.findActorNamesByMovieId(movieId);
        if (names == null) {
            // In case the repo returns null, return empty list instead
            return new ArrayList<>();
        }
        // Return the list, even if empty
        return names;
    }

}
