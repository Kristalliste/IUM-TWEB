package com.tweb.moviesProject.Actors;

import io.swagger.v3.oas.annotations.Operation;
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

    // Constructor injection for ActorService dependency
    public ActorController(ActorService actorService) {
        this.actorService = actorService;
    }

    @Operation(summary = "Returns a list of actors whose names contain the given string (case-insensitive)")
    @GetMapping("/filterByName/{name}")
    // Returns a list of actors whose names contain the specified string (case-insensitive)
    public List<Actor> findByNameContainingIgnoreCase(@PathVariable String name) {
        return actorService.findByNameContainingIgnoreCase(name);
    }

    @Operation(summary = "Returns a paginated list of actors filtered by name")
    @GetMapping("/paged")
    // Returns a paginated list of actors filtered by name
    public ResponseEntity<Page<Actor>> getPagedActors(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Actor> result = actorService.findByNameContainingIgnoreCase(name, pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Returns a list of movie titles for a given actor name (case-insensitive)")
    @GetMapping("/movieTitlesByActorName/{name}")
    // Returns a list of movie titles for the given actor name (case-insensitive)
    public ResponseEntity<List<String>> getMovieTitlesByActorName(@PathVariable String name) {
        List<String> movieTitles = actorService.findMovieNameByActorNameIgnoreCase(name);
        if (movieTitles.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(movieTitles);
    }

    @Operation(summary = "Returns a list of actor names for a given movie ID")
    @GetMapping("/namesByMovieId/{movieId}")
    // Returns a list of actor names for the specified movie ID
    public ResponseEntity<List<String>> getActorNamesByMovieId(@PathVariable Long movieId) {
        List<String> names = actorService.getActorNamesByMovieId(movieId);
        return names == null || names.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(names);
    }

}