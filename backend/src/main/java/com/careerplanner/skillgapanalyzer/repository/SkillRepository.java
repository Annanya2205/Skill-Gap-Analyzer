package com.careerplanner.skillgapanalyzer.repository;

import com.careerplanner.skillgapanalyzer.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Skill findBySkillName(String skillName);
}
