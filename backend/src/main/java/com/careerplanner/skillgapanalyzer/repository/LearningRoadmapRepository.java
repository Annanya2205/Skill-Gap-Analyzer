package com.careerplanner.skillgapanalyzer.repository;

import com.careerplanner.skillgapanalyzer.model.LearningRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, Long> {
    List<LearningRoadmap> findByUserId(Long userId);
    
    @Transactional
    void deleteByUserId(Long userId);
}
