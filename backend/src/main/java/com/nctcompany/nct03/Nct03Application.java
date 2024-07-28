package com.nctcompany.nct03;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Nct03Application {

	public static void main(String[] args) {
		SpringApplication.run(Nct03Application.class, args);
	}

}
