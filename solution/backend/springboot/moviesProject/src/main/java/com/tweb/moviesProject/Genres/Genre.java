package com.tweb.moviesProject.Genres;

import jakarta.persistence.*;

@Entity
@Table(name = "Genres")
public class Genre {

    @Id
    @Column(name = "genre_id")
    private Integer genreId;

    @Column(name = "movie_id")
    private Integer movieId;

    @Column(name = "genre")
    private String genre;

    // Costruttori
    public Genre() {}

    public Genre(Integer movieId, String genre) {
        this.movieId = movieId;
        this.genre = genre;
    }

    // Getters e Setters
    public Integer getGenreId() { return genreId; }
    public void setGenreId(Integer genreId) { this.genreId = genreId; }
    public Integer getMovieId() { return movieId; }
    public void setMovieId(Integer movieId) { this.movieId = movieId; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
}
