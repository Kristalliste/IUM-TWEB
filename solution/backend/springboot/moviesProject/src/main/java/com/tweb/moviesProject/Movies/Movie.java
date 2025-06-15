package com.tweb.moviesProject.Movies;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name="Movies")
public class Movie {

    @Id
    @Column(name = "id")
    private Integer movieId;

    @Column(name = "name")
    private String name;

    @Column(name = "date")
    private Date date;

    @Column(name = "tagline")
    private String tagline;

    @Column(name = "description")
    private String description;

    @Column(name = "minute")
    private Float minute;

    @Column(name = "rating")
    private Float rating;

    public Movie() {}

    public Movie( String name, Date date, String tagline, String description, Float minute, Float rating) {
        this.name = name;
        this.date = date;
        this.tagline = tagline;
        this.description = description;
        this.minute = minute;
        this.rating = rating;
    }

}
