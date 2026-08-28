package com.careerplanner.skillgapanalyzer.controller;

import com.careerplanner.skillgapanalyzer.model.CareerRole;
import com.careerplanner.skillgapanalyzer.model.RequiredSkill;
import com.careerplanner.skillgapanalyzer.service.CareerRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class CareerRoleController {

    @Autowired
    private CareerRoleService careerRoleService;

    @GetMapping
    public ResponseEntity<List<CareerRole>> getAllRoles() {
        return ResponseEntity.ok(careerRoleService.getAllRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CareerRole> getRoleById(@PathVariable Long id) {
        return careerRoleService.getRoleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/required-skills")
    public ResponseEntity<List<RequiredSkill>> getRequiredSkills(@PathVariable Long id) {
        return ResponseEntity.ok(careerRoleService.getRequiredSkillsForRole(id));
    }
}
