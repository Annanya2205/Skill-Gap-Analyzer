package com.careerplanner.skillgapanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "required_skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequiredSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private CareerRole careerRole;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private String importance; // Core or Optional

    @Column(name = "suggested_month")
    private Integer suggestedMonth;
}
