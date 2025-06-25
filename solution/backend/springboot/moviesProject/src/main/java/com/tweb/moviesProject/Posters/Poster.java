package com.tweb.moviesProject.Posters;

import jakarta.persistence.*;

@Entity
@Table(name = "Posters")
public class Poster {
    @Id
    @Column(name = "poster_id")
    private Long posterId; // Unique identifier for the poster

    @Column(name = "movie_id")
    private Long movieId; // References the associated movie

    @Column(name = "link")
    private String link; // URL or path to the poster image

    public Poster() { }

    // Constructor without posterId, as it is usually auto-generated
    public Poster(Long movieId, String link) {
        this.movieId = movieId;
        this.link = link;
    }

    // Getters and Setters for all fields
    public Long getPosterId() { return posterId; }
    public void setPosterId(Long posterId) { this.posterId = posterId; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
}
