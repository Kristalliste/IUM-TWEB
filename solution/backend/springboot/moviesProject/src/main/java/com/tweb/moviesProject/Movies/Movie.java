package com.tweb.moviesProject.Movies;

import com.tweb.moviesProject.Languages.Language;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name="Movies")
public class Movie {

    @Id
    @Column(name = "id")
    private Long movieId;

    @Column(name = "name")
    private String name;

    @Column(name = "date")
    private Date date;

    @Column(name = "tagline")
    private String tagline;

    @Column(name = "description")
    private String description;

    @Column(name = "minute")
    private Double minute;

    @Column(name = "rating")
    private Double rating;

    public Movie() {}

    public Movie( Long movieId, String name, Date date, String tagline, String description, Double minute, Double rating) {
        this.movieId = movieId;
        this.name = name;
        this.date = date;
        this.tagline = tagline;
        this.description = description;
        this.minute = minute;
        this.rating = rating;
    }

    // Since many instances of languages are mapped to one instance of movie
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

    public Date getDate() {
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
    public void setRating(Double rating) {this.rating = rating;}
}
