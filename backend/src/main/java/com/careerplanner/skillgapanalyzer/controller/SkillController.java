package com.careerplanner.skillgapanalyzer.controller;

import com.careerplanner.skillgapanalyzer.model.Skill;
import com.careerplanner.skillgapanalyzer.service.CareerRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*")
public class SkillController {

    @Autowired
    private CareerRoleService careerRoleService;

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(careerRoleService.getAllSkills());
    }
}
