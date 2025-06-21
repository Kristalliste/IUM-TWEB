package com.tweb.moviesProject.OscarAwards;

import jakarta.persistence.*;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "\"OscarAwards\"")
@Schema(description = "Oscar award record (film nominations and wins)")
public class OscarAward {

    // The db doesn't have a PK, we will use a dummy id here since we won't need it in queries
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dummy_id")
    @Schema(description = "Dummy ID (required by JPA, not used)", hidden = true)
    private Long id;

    @Column(name = "year_film")
    @Schema(description = "Year the film was released", example = "1997")
    private Date yearFilm;

    @Column(name = "year_ceremony")
    @Schema(description = "Year of the Oscar ceremony", example = "1998")
    private Date yearCeremony;

    @Column(name = "ceremony")
    @Schema(description = "Ceremony number", example = "70")
    private Integer ceremony;

    @Column(name = "category")
    @Schema(description = "Award category", example = "Best Picture")
    private String category;

    @Column(name = "name")
    @Schema(description = "Name of the nominee", example = "James Cameron")
    private String name;

    @Column(name = "film")
    @Schema(description = "Title of the film", example = "Titanic")
    private String film;

    @Column(name = "winner")
    @Schema(description = "True if the nominee won", example = "true")
    private Boolean winner;

    // Constructors
    public OscarAward() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Date getYearFilm() { return yearFilm; }
    public void setYearFilm(Date yearFilm) { this.yearFilm = yearFilm; }

    public Date getYearCeremony() { return yearCeremony; }
    public void setYearCeremony(Date yearCeremony) { this.yearCeremony = yearCeremony; }

    public Integer getCeremony() { return ceremony; }
    public void setCeremony(Integer ceremony) { this.ceremony = ceremony; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFilm() { return film; }
    public void setFilm(String film) { this.film = film; }

    public Boolean getWinner() { return winner; }
    public void setWinner(Boolean winner) { this.winner = winner; }
}
