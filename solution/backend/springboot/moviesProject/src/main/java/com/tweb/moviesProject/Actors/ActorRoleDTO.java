package com.tweb.moviesProject.Actors;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO for actor with role information")
public class ActorRoleDTO {
    @Schema(description = "Actor's name", example = "Tom Hanks")
    private String name;

    @Schema(description = "Actor's role in the movie", example = "Forrest Gump")
    private String role;

    public ActorRoleDTO() {}

    public ActorRoleDTO(String name, String role) {
        this.name = name;
        this.role = role;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
