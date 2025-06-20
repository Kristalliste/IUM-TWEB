package com.tweb.moviesProject.Actors;

import jakarta.persistence.*;

@Entity
@Table(name = "Actors")
public class Actor {
    @Id
    @Column(name = "actor_id")
    private Long actorId;

    @Column(name = "movie_id")
    private Long movieId;

    @Column(name = "name")
    private String name;

    @Column(name = "role")
    private String role;

    // Constructors, Getters, and Setters
    public Actor() {}

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
