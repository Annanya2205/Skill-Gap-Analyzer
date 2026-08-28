package com.careerplanner.skillgapanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String education;

    @Column(nullable = false)
    private String college;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dream_role_id")
    private CareerRole dreamRole;

    @Column(columnDefinition = "int default 0")
    private Integer xp = 0;

    @Column(columnDefinition = "int default 0")
    private Integer streak = 0;
}
