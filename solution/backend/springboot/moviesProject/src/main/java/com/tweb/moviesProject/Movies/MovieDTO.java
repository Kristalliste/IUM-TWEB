package com.tweb.moviesProject.Movies;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;
import java.util.List;

@Schema(description = "Data Transfer Object for Movie details")
public class MovieDTO {

    @Schema(description = "Unique identifier of the movie", example = "1")
    private Integer movieId;

    @Schema(description = "Name of the movie", example = "The Shawshank Redemption")
    private String name;

    @Schema(description = "Release date of the movie", example = "1994-09-23")
    private Date date;

    @Schema(description = "Tagline of the movie", example = "Fear can hold you prisoner. Hope can set you free.")
    private String tagline;

    @Schema(description = "Detailed description of the movie",
            example = "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.")
    private String description;

    @Schema(description = "Duration in minutes", example = "142")
    private Float minute;

    @Schema(description = "Average rating", example = "9.3")
    private Float rating;

    @Schema(description = "URL to the movie poster image",
            example = "https://example.com/posters/shawshank-redemption.jpg")
    private String link; // for posters

    @Schema(description = "List of genres", example = "[\"Drama\", \"Crime\"]")
    private List<String> genres;

    @Schema(description = "List of actors who starred in the movie",
            example = "[\"Tim Robbins\", \"Morgan Freeman\"]")
    private List<String> actors;

    @Schema(description = "Language of the movie", example = "English")
    private String language;
    // Constructor
    public MovieDTO() {}

    public MovieDTO(Integer movieId, String name, Date date, String tagline,
                    String description, Float minute, Float rating, String link,
                    List<String> genres, List<String> actors, String language) {
        this.movieId = movieId;
        this.name = name;
        this.date = date;
        this.tagline = tagline;
        this.description = description;
        this.minute = minute;
        this.rating = rating;
        this.link = link;
        this.genres = genres;
        this.actors = actors;
        this.language = language;
    }

    // Getters and setters

    public Integer getMovieId() {
        return movieId;
    }

    public String getTitle() {
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

    public Float getMinute() {
        return minute;
    }

    public Float getRating() {
        return rating;
    }

    public String getLink() { return link; }
    public void setLink(String link) {this.link = link;}

    public List<String> getGenres() { return genres;}

    public List<String> getActors() {
        return actors;
    }
    public void setActors(List<String> actors) {
        this.actors = actors;
    }

    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
}
