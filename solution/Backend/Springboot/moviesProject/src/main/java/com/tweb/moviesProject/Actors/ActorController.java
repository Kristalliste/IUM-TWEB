package com.tweb.moviesProject.Actors;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actors")
public class ActorController {
    private final ActorService actorService;

    public ActorController(ActorService actorService) {this.actorService = actorService;}

    @GetMapping("/filterByName/{name}")
    public List<Actor> findByNameContainingIgnoreCase(@PathVariable String name) {
        return actorService.findByNameContainingIgnoreCase(name);
    }

    @GetMapping("/random")
    public ResponseEntity<Actor> getRandomActor() {
        Actor actor = actorService.getRandomActor();
        if (actor != null) {
            return ResponseEntity.ok(actor);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Actor>> getPagedActors(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Actor> result = actorService.findByNameContainingIgnoreCase(name, pageable);
        return ResponseEntity.ok(result);
    }

}

