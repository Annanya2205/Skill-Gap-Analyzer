package com.careerplanner.skillgapanalyzer.repository;

import com.careerplanner.skillgapanalyzer.model.SkillResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillResourceRepository extends JpaRepository<SkillResource, Long> {
    List<SkillResource> findBySkillId(Long skillId);
    List<SkillResource> findBySkillIdIn(List<Long> skillIds);
}
