package com.careerplanner.skillgapanalyzer.repository;

import com.careerplanner.skillgapanalyzer.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserId(Long userId);
    
    @Transactional
    void deleteByUserId(Long userId);
}
