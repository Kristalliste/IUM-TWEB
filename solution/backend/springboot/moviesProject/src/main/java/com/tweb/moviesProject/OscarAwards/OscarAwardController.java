/*package com.tweb.moviesProject.OscarAwards;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/oscarawards")
@Tag(name = "Oscar Awards", description = "Endpoints to check Oscar-winning movies")
public class OscarAwardController {

    private final OscarAwardService oscarAwardService;

    @Autowired
    public OscarAwardController(OscarAwardService oscarAwardService) {
        this.oscarAwardService = oscarAwardService;
    }

    @Operation(summary = "Check if a single movie has won an Oscar",
            description = "Returns true if the movie title exists in the OscarAwards database, false otherwise")
    @GetMapping("/exists")
    public ResponseEntity<Boolean> hasOscar(@RequestParam String film) {
        boolean exists = oscarAwardService.hasOscar(film);
        return ResponseEntity.ok(exists);
    }

    @Operation(summary = "Check multiple movies for Oscar wins",
            description = "Accepts a JSON list of movie titles and returns a map of title to boolean indicating Oscar presence")
    @PostMapping("/exists/batch")
    public ResponseEntity<Map<String, Boolean>> hasOscarBatch(@RequestBody List<String> films) {
        Map<String, Boolean> results = oscarAwardService.hasOscarBatch(films);
        return ResponseEntity.ok(results);
    }
}
*/