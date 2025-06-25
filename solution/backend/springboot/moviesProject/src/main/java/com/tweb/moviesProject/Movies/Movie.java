package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Languages.Language;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name="Movies")
public class Movie {

    @Id
    @Column(name = "id")
    private Long movieId; // Unique identifier for the movie

    @Column(name = "name")
    private String name; // Movie title

    @Column(name = "date")
    private LocalDate date; // Release date

    @Column(name = "tagline")
    private String tagline; // Short tagline

    @Column(name = "description")
    private String description; // Movie description

    @Column(name = "minute")
    private Double minute; // Duration in minutes

    @Column(name = "rating")
    private Double rating; // Movie rating

    public Movie() {}

    // Constructor with all fields except languages
    public Movie(Long movieId, String name, LocalDate date, String tagline, String description, Double minute, Double rating) {
        this.movieId = movieId;
        this.name = name;
        this.date = date;
        this.tagline = tagline;
        this.description = description;
        this.minute = minute;
        this.rating = rating;
    }

    // One movie can have multiple languages
    @OneToMany
    @JoinColumn(name = "movie_id", referencedColumnName = "id") // connects Movie.id to Language.movie_id
    private List<Language> languages;

    public List<Language> getLanguages() { return languages; }
    public void setLanguages(List<Language> languages) { this.languages = languages; }

    // Getters

    public Long getMovieId() {
        return movieId;
    }

    public String getName() {
        return name;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getTagline() {
        return tagline;
    }

    public String getDescription() {
        return description;
    }

    public Double getMinute() {
        return minute;
    }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
}
