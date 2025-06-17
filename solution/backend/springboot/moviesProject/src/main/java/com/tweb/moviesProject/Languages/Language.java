package com.tweb.moviesProject.Languages;

import com.tweb.moviesProject.Movies.Movie;
import jakarta.persistence.*;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "\"Languages\"")
@Schema(description = "Language entity representing the language(s) of a movie")
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "language_id")
    @Schema(description = "Unique ID of the language", example = "1")
    private Integer languageId;

    @Column(name = "language")
    @Schema(description = "Language name", example = "English")
    private String language;

    @Column(name = "type")
    @Schema(description = "Type of language (e.g., original, dubbed)", example = "original")
    private String type;

    @Column(name = "movie_id")
    @Schema(description = "ID of the movie this language is associated with", example = "101")
    private Integer movieId;

    // Getters and Setters
    public Integer getLanguageId() { return languageId; }
    public void setLanguageId(Integer languageId) { this.languageId = languageId; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getMovieId() { return movieId; }
    public void setMovieId(Integer movieId) { this.movieId = movieId; }
}