package com.tweb.moviesProject.Actors;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/actors")
public class ActorController {
    private final ActorService actorService;

    public ActorController(ActorService actorService) {this.actorService = actorService;}

    @GetMapping("/filterByName")
    public List<Actor> findByName(@RequestParam String name) {
        return actorService.findByName(name);
    }
}

