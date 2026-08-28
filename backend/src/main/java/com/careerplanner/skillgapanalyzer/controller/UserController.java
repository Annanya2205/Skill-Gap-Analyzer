package com.careerplanner.skillgapanalyzer.controller;

import com.careerplanner.skillgapanalyzer.dto.UserProfileSubmissionDto;
import com.careerplanner.skillgapanalyzer.model.User;
import com.careerplanner.skillgapanalyzer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createProfile(@RequestBody UserProfileSubmissionDto submissionDto) {
        User savedUser = userService.saveProfile(submissionDto);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
