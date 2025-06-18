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

    public String getPosterByMovieId(Integer movieId) {
        String link = posterRepository.findPosterLinkByMovieId(movieId);
        if (link == null || link.isEmpty()) {
            // Default poster URL
            link = "default-poster.jpg";
            //throw new PosterNotFoundException("Poster not found for movie with ID: " + movieId);
        }
        return link;
    }

    // Method to fetch posters in bulk
    public Map<Integer, String> getPostersByMovieIds(List<Integer> movieIds) {
        Map<Integer, String> postersMap = new HashMap<>();

        for (Integer movieId : movieIds) {
            String link = posterRepository.findPosterLinkByMovieId(movieId);
            if (link == null || link.isEmpty()) {
                // Default poster URL
                link = "default-poster.jpg";
            }
            postersMap.put(movieId, link);
        }

        return postersMap;
    }
}

