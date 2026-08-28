package com.careerplanner.skillgapanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "skill_resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "resource_name", nullable = false)
    private String resourceName;

    @Column(name = "resource_url", nullable = false)
    private String resourceUrl;

    @Column(nullable = false)
    private String type; // Tutorial, Documentation, Course, Practice Platform
}
