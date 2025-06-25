package com.tweb.moviesProject.Movies;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tweb.moviesProject.Actors.ActorRoleDTO;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

@Schema(description = "Data Transfer Object for movie details")
public class MovieDTO {
    @Schema(description = "Unique identifier of the movie", example = "1")
    private Long movieId;

    @Schema(description = "Name of the movie", example = "The Shawshank Redemption")
    private String name;

    @Schema(description = "Release date of the movie", example = "1994-09-23")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Schema(description = "Detailed description of the movie")
    private String description;

    @Schema(description = "Duration in minutes", example = "142.0")
    private Double minute;

    @Schema(description = "Average rating", example = "9.3")
    private Double rating;

    @Schema(description = "URL to the movie poster image")
    private String link;

    @Schema(description = "List of genres", example = "[\"Drama\", \"Crime\"]")
    private List<String> genres;

    @Schema(description = "List of actors with their roles")
    private List<ActorRoleDTO> actors;

    @Schema(description = "All spoken languages for the movie", example = "[\"English\", \"French\"]")
    private List<String> languages;

    @Schema(description = "Indicates if the movie has any Oscar nominations or wins", example = "true")
    private Boolean hasOscar;

    // Default constructor required for serialization/deserialization
    public MovieDTO() {}

    // All-args constructor for easy instantiation
    public MovieDTO(Long movieId, String name, LocalDate date, String description,
                    Double minute, Double rating, String link, List<String> genres,
                    List<ActorRoleDTO> actors, List<String> languages, Boolean hasOscar) {
        this.movieId = movieId;
        this.name = name;
        this.date = date;
        this.description = description;
        this.minute = minute;
        this.rating = rating;
        this.link = link;
        this.genres = genres;
        this.actors = actors;
        this.languages = languages;
        this.hasOscar = hasOscar;
    }

    // Getters and Setters for all fields

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getMinute() { return minute; }
    public void setMinute(Double minute) { this.minute = minute; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public List<String> getGenres() { return genres; }
    public void setGenres(List<String> genres) { this.genres = genres; }

    public List<ActorRoleDTO> getActors() { return actors; }
    public void setActors(List<ActorRoleDTO> actors) { this.actors = actors; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public Boolean getHasOscar() { return hasOscar; }
    public void setHasOscar(Boolean hasOscar) { this.hasOscar = hasOscar; }
}
