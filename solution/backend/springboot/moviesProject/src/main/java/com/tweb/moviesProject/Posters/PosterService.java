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

    /**
     * Returns the poster link for a given movie ID.
     * If no poster is found, returns a placeholder image link.
     */
    public String getPosterByMovieId(Long movieId) {
        String link = posterRepository.findPosterLinkByMovieId(movieId);
        if (link == null || link.isEmpty()) {
            link = "https://placehold.co/300x450?text=No+Image";
        }
        return link;
    }

    /**
     * Returns a map of movie IDs to poster links.
     * For movies without a poster, a placeholder image link is used.
     */
    public Map<Long, String> getPostersByMovieIds(List<Long> movieIds) {
        Map<Long, String> postersMap = new HashMap<>();

        for (Long movieId : movieIds) {
            String link = posterRepository.findPosterLinkByMovieId(movieId);
            // Use placeholder if no poster is found
            postersMap.put(movieId, (link != null && !link.isEmpty()) ? link : "https://placehold.co/300x450?text=No+Image");
        }

        return postersMap;
    }
}