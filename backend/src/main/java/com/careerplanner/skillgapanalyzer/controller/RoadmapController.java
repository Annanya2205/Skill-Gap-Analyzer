package com.careerplanner.skillgapanalyzer.controller;

import com.careerplanner.skillgapanalyzer.dto.RoadmapMilestoneReport;
import com.careerplanner.skillgapanalyzer.model.LearningRoadmap;
import com.careerplanner.skillgapanalyzer.service.RoadmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
@CrossOrigin(origins = "*")
public class RoadmapController {

    @Autowired
    private RoadmapService roadmapService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<RoadmapMilestoneReport>> getUserRoadmap(@PathVariable Long userId) {
        try {
            List<RoadmapMilestoneReport> roadmap = roadmapService.getRoadmap(userId);
            return ResponseEntity.ok(roadmap);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/milestones/{milestoneId}/complete")
    public ResponseEntity<LearningRoadmap> completeMilestone(@PathVariable Long milestoneId) {
        try {
            LearningRoadmap updated = roadmapService.completeMilestone(milestoneId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
