package com.tweb.moviesProject.Languages;

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
    private Long languageId;

    @Column(name = "language")
    @Schema(description = "Language name", example = "English")
    private String language;

    @Column(name = "type")
    @Schema(description = "Type of language (e.g., original, dubbed)", example = "original")
    private String type;

    @Column(name = "movie_id")
    @Schema(description = "ID of the movie this language is associated with", example = "1000001")
    private Long movieId;

    // Getters and Setters
    public Long getLanguageId() { return languageId; }
    public void setLanguageId(Long languageId) { this.languageId = languageId; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }
}