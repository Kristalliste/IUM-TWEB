package com.tweb.moviesProject.Actors;

import jakarta.persistence.*;

@Entity
@Table(name = "Actors")
public class Actor {
    @Id
    @Column(name = "actor_id")
    private Integer actorId;

    @Column(name = "movie_id")
    private Integer movieId;

    @Column(name = "name")
    private String name;

    @Column(name = "role")
    private String role;

    // Constructors, Getters, and Setters
    public Actor() {}

    public Actor(Integer movieId, String name, String role) {
        this.movieId = movieId;
        this.name = name;
        this.role = role;
    }

    // Getters and Setters for all fields
    public Integer getActorId() { return actorId; }
    public void setActorId(Integer actorId) { this.actorId = actorId; }
    public Integer getMovieId() { return movieId; }
    public void setMovieId(Integer movieId) { this.movieId = movieId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
