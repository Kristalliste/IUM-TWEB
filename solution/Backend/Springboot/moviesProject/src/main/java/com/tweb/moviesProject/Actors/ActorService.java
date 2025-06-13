package com.tweb.moviesProject.Actors;

import org.springframework.beans.factory.annotation.Autowired;
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

    public Actor getRandomActor() {
        return actorRepository.findRandomActor();
    }
}
