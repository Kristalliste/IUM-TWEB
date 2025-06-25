package com.tweb.moviesProject.OscarAwards;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class OscarAwardService {

    private final OscarAwardRepository oscarAwardRepository;

    @Autowired
    public OscarAwardService(OscarAwardRepository oscarAwardRepository) {
        this.oscarAwardRepository = oscarAwardRepository;
    }

    /**
     * Checks if a film has won an Oscar.
     * @param film the name of the film
     * @return true if the film has won an Oscar, false otherwise
     */
    public boolean hasOscar(String film) {
        return oscarAwardRepository.existsByFilm(film);
    }

    /**
     * Batch check: for each film in the list, returns true if it has won an Oscar.
     * The check is case-insensitive and null-safe.
     * @param films list of film names
     * @return map from film name to boolean indicating Oscar win
     */
    public Map<String, Boolean> hasOscarBatch(List<String> films) {
        // Retrieve the list of films that exist in the database
        List<String> filmsInDb = oscarAwardRepository.findFilmsInList(films);
        Set<String> filmsSet = new HashSet<>();
        for (String filmInDb : filmsInDb) {
            if (filmInDb != null) {
                filmsSet.add(filmInDb.toLowerCase());
            }
        }

        Map<String, Boolean> result = new HashMap<>();
        // For each film, check if it exists in the set (case-insensitive)
        for (String film : films) {
            result.put(film, film != null && filmsSet.contains(film.toLowerCase()));
        }
        return result;
    }
}
