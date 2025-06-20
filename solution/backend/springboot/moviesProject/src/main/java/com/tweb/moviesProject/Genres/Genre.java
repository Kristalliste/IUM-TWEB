package com.tweb.moviesProject.Genres;

import jakarta.persistence.*;

@Entity
@Table(name = "Genres")
public class Genre {

    @Id
    @Column(name = "genre_id")
    private Long genreId;

    @Column(name = "movie_id")
    private Long movieId;

    @Column(name = "genre")
    private String genre;

    // Costruttori
    public Genre() {}

    public Genre(Long movieId, String genre) {
        this.movieId = movieId;
        this.genre = genre;
    }

    // Getters e Setters
    public Long getGenreId() { return genreId; }
    public void setGenreId(Long genreId) { this.genreId = genreId; }
    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
}
