package com.careerplanner.skillgapanalyzer.service;

import com.careerplanner.skillgapanalyzer.model.CareerRole;
import com.careerplanner.skillgapanalyzer.model.RequiredSkill;
import com.careerplanner.skillgapanalyzer.model.Skill;
import com.careerplanner.skillgapanalyzer.repository.CareerRoleRepository;
import com.careerplanner.skillgapanalyzer.repository.RequiredSkillRepository;
import com.careerplanner.skillgapanalyzer.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CareerRoleService {

    @Autowired
    private CareerRoleRepository careerRoleRepository;

    @Autowired
    private RequiredSkillRepository requiredSkillRepository;

    @Autowired
    private SkillRepository skillRepository;

    public List<CareerRole> getAllRoles() {
        return careerRoleRepository.findAll();
    }

    public Optional<CareerRole> getRoleById(Long id) {
        return careerRoleRepository.findById(id);
    }

    public List<RequiredSkill> getRequiredSkillsForRole(Long roleId) {
        return requiredSkillRepository.findByCareerRoleIdOrderBySuggestedMonthAsc(roleId);
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }
}
