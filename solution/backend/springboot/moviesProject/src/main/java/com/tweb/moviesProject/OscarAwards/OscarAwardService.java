package com.tweb.moviesProject.OscarAwards;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Service to check if a movie has won or been nominated for an Oscar.
 */
@Service
@Tag(name = "Oscar Award Service", description = "Service layer for Oscar Awards data")
public class OscarAwardService {

    private final OscarAwardRepository oscarAwardRepository;

    @Autowired
    public OscarAwardService(OscarAwardRepository oscarAwardRepository) {
        this.oscarAwardRepository = oscarAwardRepository;
    }

    /**
     * Checks whether a film exists in the OscarAwards database.
     *
     * @param film Title of the film
     * @return true if the film exists in the table, false otherwise
     */
    @Operation(summary = "Check if a movie has won or been nominated for an Oscar")
    public boolean hasOscar(String film) {
        return oscarAwardRepository.existsByFilm(film);
    }

    /**
     * Checks a batch of films for Oscar wins.
     *
     * @param films List of film titles
     * @return Map of film title to boolean indicating Oscar presence
     */
    @Operation(summary = "Check multiple movies for Oscar wins in batch")
    public Map<String, Boolean> hasOscarBatch(List<String> films) {
        List<String> filmsInDb = oscarAwardRepository.findFilmsInList(films);

        // Create a set of lowercase film titles from DB results
        Set<String> filmsSet = new HashSet<>();
        for (String filmInDb : filmsInDb) {
            if (filmInDb != null) {
                filmsSet.add(filmInDb.toLowerCase());
            }
        }

        Map<String, Boolean> result = new HashMap<>();
        for (String film : films) {
            result.put(film, film != null && filmsSet.contains(film.toLowerCase()));
        }
        return result;
    }
}
