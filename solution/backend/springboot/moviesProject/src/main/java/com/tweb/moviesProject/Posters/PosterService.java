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

    public String getPosterByMovieId(Long movieId) {
        String link = posterRepository.findPosterLinkByMovieId(movieId);
        if (link == null || link.isEmpty()) {
            // Default poster URL
            link = "default-poster.jpg";
            //throw new PosterNotFoundException("Poster not found for movie with ID: " + movieId);
        }
        return link;
    }

    // Method to fetch posters in bulk
    public Map<Long, String> getPostersByMovieIds(List<Long> movieIds) {
        Map<Long, String> postersMap = new HashMap<>();

        for (Long movieId : movieIds) {
            String link = posterRepository.findPosterLinkByMovieId(movieId);
            postersMap.put(movieId, (link != null && !link.isEmpty()) ? link : "default-poster.jpg");
        }

        return postersMap;
    }
}

