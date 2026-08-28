package com.careerplanner.skillgapanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "career_roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CareerRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_name", nullable = false, unique = true)
    private String roleName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
}
