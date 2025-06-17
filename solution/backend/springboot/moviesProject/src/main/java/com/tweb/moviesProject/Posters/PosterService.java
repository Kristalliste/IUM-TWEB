package com.tweb.moviesProject.Posters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PosterService {

    private final PosterRepository posterRepository;

    @Autowired
    public PosterService(PosterRepository posterRepository) {
        this.posterRepository = posterRepository;
    }

    public Map<Integer, String> getPostersForMovies(List<Integer> movieIds) {
        List<Object[]> results = posterRepository.findLinksByMovieIds(movieIds);
        Map<Integer, String> postersMap = new HashMap<>();

        for (Object[] result : results) {
            Integer movieId = (Integer) result[0];
            String link = (String) result[1];
            postersMap.put(movieId, link);
        }

        return postersMap;
    }
}
