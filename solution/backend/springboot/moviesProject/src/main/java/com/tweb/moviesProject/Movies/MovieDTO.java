package com.tweb.moviesProject.Movies;

import java.util.Date;
import java.util.List;

public class MovieDTO {

    private Integer movieId;
    private String name;
    private Date date;
    private String tagline;
    private String description;
    private Float minute;
    private Float rating;
    private String link; // Nuovo campo per il poster
    private List<String> genres; // Nuovo campo per i generi

    public MovieDTO() {}

    public MovieDTO(Integer movieId, String name, Date date, String tagline,
                    String description, Float minute, Float rating, String link,
                    List<String> genres) {
        this.movieId = movieId;
        this.name = name;
        this.date = date;
        this.tagline = tagline;
        this.description = description;
        this.minute = minute;
        this.rating = rating;
        this.link = link;
        this.genres = genres;
    }

    // Getters e setters

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
}
