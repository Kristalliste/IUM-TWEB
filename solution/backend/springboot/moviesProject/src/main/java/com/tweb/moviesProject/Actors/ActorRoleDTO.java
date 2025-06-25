package com.tweb.moviesProject.Actors;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO for actor with role information")
public class ActorRoleDTO {
    @Schema(description = "Actor's name", example = "Tom Hanks")
    private String name;

    @Schema(description = "Actor's role in the movie", example = "Forrest Gump")
    private String role;

    // Default constructor required for serialization/deserialization
    public ActorRoleDTO() {}

    // Constructor with parameters for easy instantiation
    public ActorRoleDTO(String name, String role) {
        this.name = name;
        this.role = role;
    }

    // Getter for actor's name
    public String getName() { return name; }

    // Setter for actor's name
    public void setName(String name) { this.name = name; }

    // Getter for actor's role
    public String getRole() { return role; }

    // Setter for actor's role
    public void setRole(String role) { this.role = role; }
}