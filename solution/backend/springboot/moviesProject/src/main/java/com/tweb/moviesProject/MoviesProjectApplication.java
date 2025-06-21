package com.tweb.moviesProject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.boot.autoconfigure.domain.EntityScan;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication() //scanBasePackages = "com.tweb.moviesProject")
//@EnableJpaRepositories
//@EntityScan
public class MoviesProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoviesProjectApplication.class, args);
	}

}
