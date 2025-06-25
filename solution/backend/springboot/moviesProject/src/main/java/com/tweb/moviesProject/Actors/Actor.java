package com.tweb.moviesProject.Actors;

import jakarta.persistence.*;

@Entity
@Table(name = "Actors")
public class Actor {
    // Primary key for the Actor entity
    @Id
    @Column(name = "actor_id")
    private Long actorId;

    // Foreign key referencing the related movie
    @Column(name = "movie_id")
    private Long movieId;

    //Actor's name
    @Column(name = "name")
    private String name;

    // Actor's role in the movie
    @Column(name = "role")
    private String role;

    // Default constructor required by JPA
    public Actor() {}

    // Constructor to initialize Actor with movieId, name, and role
    public Actor(Long movieId, String name, String role) {
        this.movieId = movieId;
        this.name = name;
        this.role = role;
    }

    // Getters and Setters for all fields
    public Long getActorId() { return actorId; }
    public void setActorId(Long actorId) { this.actorId = actorId; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
