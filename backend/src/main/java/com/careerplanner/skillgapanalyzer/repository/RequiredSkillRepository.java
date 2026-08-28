package com.careerplanner.skillgapanalyzer.repository;

import com.careerplanner.skillgapanalyzer.model.RequiredSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequiredSkillRepository extends JpaRepository<RequiredSkill, Long> {
    List<RequiredSkill> findByCareerRoleId(Long roleId);
    List<RequiredSkill> findByCareerRoleIdOrderBySuggestedMonthAsc(Long roleId);
}
