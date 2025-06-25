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

    /**
     * Gets the unique ID of the language.
     * @return languageId
     */
    public Long getLanguageId() { return languageId; }

    /**
     * Sets the unique ID of the language.
     * @param languageId the ID to set
     */
    public void setLanguageId(Long languageId) { this.languageId = languageId; }

    /**
     * Gets the language name.
     * @return language
     */
    public String getLanguage() { return language; }

    /**
     * Sets the language name.
     * @param language the language to set
     */
    public void setLanguage(String language) { this.language = language; }

    /**
     * Gets the type of language (e.g., original, dubbed).
     * @return type
     */
    public String getType() { return type; }

    /**
     * Sets the type of language.
     * @param type the type to set
     */
    public void setType(String type) { this.type = type; }

    /**
     * Gets the ID of the associated movie.
     * @return movieId
     */
    public Long getMovieId() { return movieId; }

    /**
     * Sets the ID of the associated movie.
     * @param movieId the movie ID to set
     */
    public void setMovieId(Long movieId) { this.movieId = movieId; }
}