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

    public boolean hasOscar(String film) {
        return oscarAwardRepository.existsByFilm(film);
    }

    public Map<String, Boolean> hasOscarBatch(List<String> films) {
        List<String> filmsInDb = oscarAwardRepository.findFilmsInList(films);
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
