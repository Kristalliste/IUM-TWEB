package com.tweb.moviesProject.Languages;

import com.tweb.moviesProject.Movies.Movie;
import jakarta.persistence.*;

@Entity
@Table(name = "\"Languages\"")
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "language_id")
    private Integer languageId;

    @Column(name = "language", nullable = false)
    private String language;

    @Column(name = "type", nullable = false)
    private String type;

    // Foreign key column
    @Column(name = "movie_id", nullable = false)
    private Integer movieId;

    // Many languages belong to one movie
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;

    // Default constructor for JPA
    public Language() {}

    public Language(Integer languageId, String language, String type, Integer movieId) {
        this.languageId = languageId;
        this.language = language;
        this.type = type;
        this.movieId = movieId;
    }

    // Getters and setters
    public Integer getLanguageId() {
        return languageId;
    }

    public void setLanguageId(Integer languageId) {
        this.languageId = languageId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }
}
