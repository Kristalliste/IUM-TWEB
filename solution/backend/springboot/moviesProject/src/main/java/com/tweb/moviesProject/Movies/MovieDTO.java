package com.tweb.moviesProject.Movies;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;
import java.util.Calendar;
import java.util.List;

@Schema(description = "Data Transfer Object for movie details")
public class MovieDTO {

    @Schema(description = "Unique identifier of the movie", example = "1")
    private Integer movieId;

    @Schema(description = "Name of the movie", example = "The Shawshank Redemption")
    private String name;

    @Schema(description = "Release date of the movie", example = "1994-09-23")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;

    /*@Schema(description = "Tagline of the movie", example = "Fear can hold you prisoner. Hope can set you free.")
    private String tagline;*/

    @Schema(description = "Detailed description of the movie",
            example = "Two imprisoned men bond over a number of years...")
    private String description;

    @Schema(description = "Duration in minutes", example = "142.0")
    private Double minute;

    @Schema(description = "Average rating", example = "9.3")
    private Double rating;

    @Schema(description = "URL to the movie poster image",
            example = "https://example.com/posters/shawshank.jpg")
    private String link; // for posters

    @Schema(description = "List of genres", example = "[\"Drama\", \"Crime\"]")
    private List<String> genres;

    @Schema(description = "List of actor names", example = "[\"Tim Robbins\", \"Morgan Freeman\"]")
    private List<String> actors;

    @Schema(description = "All spoken languages for the movie", example = "[\"English\", \"French\"]")
    private List<String> languages;

    @Schema(description = "Indicates if the movie has any Oscar nominations or wins", example = "true")
    private Boolean hasOscar;

    // Constructors
    public MovieDTO() {}

    public MovieDTO(Integer movieId, String name, Date date,/*String tagline,*/
                    String description, Double minute, Double rating, String link,
                    List<String> genres, List<String> actors, List<String> languages,
                    Boolean hasOscar) {
        this.movieId = movieId;
        this.name = name;
        this.date = date;
        //this.tagline = tagline;
        this.description = description;
        this.minute = minute;
        this.rating = rating;
        this.link = link;
        this.genres = genres;
        this.actors = actors;
        this.languages = languages;
        this.hasOscar = hasOscar;
    }

    // Getters and Setters
    public Integer getMovieId() {
        return movieId;
    }
    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }

    // Convenience method to get only the year part of the date
    public Integer getYear() {
        if (this.date == null) { return null; }
        Calendar cal = Calendar.getInstance();
        cal.setTime(this.date);
        return cal.get(Calendar.YEAR);
    }

    /**
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    */

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public Double getMinute() {
        return minute;
    }
    public void setMinute(Double minute) {
        this.minute = minute;
    }

    public Double getRating() {return rating;}
    public void setRating(Double rating) {this.rating = rating;}

    public String getLink() {
        return link;
    }
    public void setLink(String link) { this.link = link; }

    public List<String> getGenres() {
        return genres;
    }
    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public List<String> getActors() {
        return actors;
    }
    public void setActors(List<String> actors) {
        this.actors = actors;
    }

    public List<String> getLanguages() {
        return languages;
    }
    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }

    public Boolean getHasOscar() { return hasOscar; }
    public void setHasOscar(Boolean hasOscar) { this.hasOscar = hasOscar; }
}
