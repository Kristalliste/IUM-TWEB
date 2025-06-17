package com.tweb.moviesProject.Posters;

import jakarta.persistence.*;

@Entity
@Table(name = "Posters")
public class Poster {
    @Id
    @Column(name = "poster_id")
    private Integer posterId;

    @Column(name = "movie_id")
    private Integer movieId;

    @Column(name = "link")
    private String link;

    public Poster() {
    }

    public Poster(Integer movieId, String link) {
        this.movieId = movieId;
        this.link = link;
    }

    // Getters and Setters for all fields
    public Integer getPosterId() {return posterId;}

    public void setPosterId(Integer posterId) {this.posterId = posterId;}

    public Integer getMovieId() {return movieId;}

    public void setMovieId(Integer movieId) {this.movieId = movieId;}

    public String getLink() {return link;}

    public void setLink(String link) {this.link = link;}
}
