package com.tweb.moviesProject.Languages;

import com.tweb.moviesProject.Movies.Movie;
import jakarta.persistence.*;

@Entity
@Table(name = "\"Languages\"")
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "language_id")
    private Long id;

    @Column(name = "language")
    private String language;

    @Column(name = "type")
    private String type;

    @Column(name = "movie_id")
    private Long movieId;

    // Since many instances of movies are mapped to one instance of language
    @ManyToOne
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }
}
