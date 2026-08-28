package com.careerplanner.skillgapanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "learning_roadmaps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningRoadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String milestone; // e.g. Month 1: OOP & Java

    @Column(name = "target_month", nullable = false)
    private Integer targetMonth;

    @Column(name = "skills_covered", nullable = false)
    private String skillsCovered; // Comma-separated list of skill names/IDs

    @Column(columnDefinition = "boolean default false")
    private Boolean completed = false;

    @Column(name = "target_date")
    private LocalDate targetDate;
}
