package com.tweb.moviesProject.Actors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.QPageRequest;
import org.springframework.stereotype.Service;

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

    public Actor getRandomActor() {
        return actorRepository.findRandomActor();
    }
}
