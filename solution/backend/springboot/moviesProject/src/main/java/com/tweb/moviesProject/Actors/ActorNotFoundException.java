package com.tweb.moviesProject.Actors;

// Custom exception thrown when an actor is not found in the database
public class ActorNotFoundException extends RuntimeException {
    // Constructor that accepts a custom error message
    public ActorNotFoundException(String message) {
        super(message);
    }
}
