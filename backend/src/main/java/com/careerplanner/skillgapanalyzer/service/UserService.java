package com.careerplanner.skillgapanalyzer.service;

import com.careerplanner.skillgapanalyzer.dto.UserProfileSubmissionDto;
import com.careerplanner.skillgapanalyzer.model.CareerRole;
import com.careerplanner.skillgapanalyzer.model.User;
import com.careerplanner.skillgapanalyzer.model.UserSkill;
import com.careerplanner.skillgapanalyzer.model.Skill;
import com.careerplanner.skillgapanalyzer.repository.UserRepository;
import com.careerplanner.skillgapanalyzer.repository.CareerRoleRepository;
import com.careerplanner.skillgapanalyzer.repository.UserSkillRepository;
import com.careerplanner.skillgapanalyzer.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.annotation.Lazy;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CareerRoleRepository careerRoleRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    @Lazy
    private RoadmapService roadmapService;

    public User saveUser(User user) {
        if (user.getXp() == null) {
            user.setXp(0);
        }
        if (user.getStreak() == null) {
            user.setStreak(0);
        }
        return userRepository.save(user);
    }

    @Transactional
    public User saveProfile(UserProfileSubmissionDto dto) {
        // Create user
        User user = new User();
        user.setName(dto.getName());
        user.setEducation(dto.getEducation());
        user.setCollege(dto.getCollege());
        user.setGraduationYear(dto.getGraduationYear());
        user.setXp(100); // 100 XP starter bonus!
        user.setStreak(1); // Starting streak

        if (dto.getDreamRoleId() != null) {
            CareerRole role = careerRoleRepository.findById(dto.getDreamRoleId()).orElse(null);
            user.setDreamRole(role);
        }

        User savedUser = userRepository.save(user);

        // Save skills
        if (dto.getSkills() != null) {
            for (UserProfileSubmissionDto.SkillAssessment sa : dto.getSkills()) {
                Skill skill = skillRepository.findById(sa.getSkillId()).orElse(null);
                if (skill != null) {
                    UserSkill us = new UserSkill();
                    us.setUser(savedUser);
                    us.setSkill(skill);
                    us.setProficiency(sa.getProficiency());
                    userSkillRepository.save(us);
                }
            }
        }

        // Generate learning roadmap
        roadmapService.generateRoadmap(savedUser.getId());

        return savedUser;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User addXp(Long userId, int xpAmount) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setXp(user.getXp() + xpAmount);
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with ID: " + userId);
    }

    public User incrementStreak(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStreak(user.getStreak() + 1);
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with ID: " + userId);
    }

    public User resetStreak(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStreak(0);
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with ID: " + userId);
    }
}
