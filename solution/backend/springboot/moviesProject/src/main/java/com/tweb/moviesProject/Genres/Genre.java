package com.tweb.moviesProject.Genres;

import jakarta.persistence.*;

@Entity
@Table(name = "Genres")
public class Genre {

    @Id
    @Column(name = "genre_id")
    private Long genreId; // Primary key for the Genre entity

    @Column(name = "movie_id")
    private Long movieId; // Foreign key referencing the related movie

    @Column(name = "genre")
    private String genre; // Name of the genre

    // Constructors
    public Genre() {}

    // Constructor used to create a Genre with a movieId and genre name
    public Genre(Long movieId, String genre) {
        this.movieId = movieId;
        this.genre = genre;
    }

    // Getters and Setters
    public Long getGenreId() { return genreId; }
    public void setGenreId(Long genreId) { this.genreId = genreId; }
    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
}
