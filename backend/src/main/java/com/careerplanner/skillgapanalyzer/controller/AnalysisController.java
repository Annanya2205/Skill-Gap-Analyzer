package com.careerplanner.skillgapanalyzer.controller;

import com.careerplanner.skillgapanalyzer.dto.SkillGapReport;
import com.careerplanner.skillgapanalyzer.service.SkillGapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
public class AnalysisController {

    @Autowired
    private SkillGapService skillGapService;

    @GetMapping("/{userId}")
    public ResponseEntity<SkillGapReport> getSkillGapAnalysis(@PathVariable Long userId) {
        try {
            SkillGapReport report = skillGapService.generateReport(userId);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
