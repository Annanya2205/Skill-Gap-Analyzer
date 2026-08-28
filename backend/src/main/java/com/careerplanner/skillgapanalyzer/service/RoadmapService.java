package com.careerplanner.skillgapanalyzer.service;

import com.careerplanner.skillgapanalyzer.dto.RoadmapMilestoneReport;
import com.careerplanner.skillgapanalyzer.model.*;
import com.careerplanner.skillgapanalyzer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    @Autowired
    private LearningRoadmapRepository roadmapRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequiredSkillRepository requiredSkillRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private SkillResourceRepository resourceRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public void generateRoadmap(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Delete any existing roadmap for the user
        roadmapRepository.deleteByUserId(userId);

        if (user.getDreamRole() == null) {
            return;
        }

        // Get required skills for the dream role
        List<RequiredSkill> requiredSkills = requiredSkillRepository.findByCareerRoleId(user.getDreamRole().getId());

        // Group by suggested month
        Map<Integer, List<RequiredSkill>> skillsByMonth = requiredSkills.stream()
                .collect(Collectors.groupingBy(RequiredSkill::getSuggestedMonth));

        LocalDate currentDate = LocalDate.now();

        for (Map.Entry<Integer, List<RequiredSkill>> entry : skillsByMonth.entrySet()) {
            Integer month = entry.getKey();
            List<RequiredSkill> monthSkills = entry.getValue();

            String skillNames = monthSkills.stream()
                    .map(rs -> rs.getSkill().getSkillName())
                    .collect(Collectors.joining(", "));

            String milestoneName = "Month " + month + ": Learn " + skillNames;

            LearningRoadmap roadmap = new LearningRoadmap();
            roadmap.setUser(user);
            roadmap.setMilestone(milestoneName);
            roadmap.setTargetMonth(month);
            roadmap.setSkillsCovered(monthSkills.stream()
                    .map(rs -> rs.getSkill().getId().toString())
                    .collect(Collectors.joining(",")));
            roadmap.setCompleted(false);
            roadmap.setTargetDate(currentDate.plusMonths(month));

            roadmapRepository.save(roadmap);
        }
    }

    public List<RoadmapMilestoneReport> getRoadmap(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        List<LearningRoadmap> milestones = roadmapRepository.findByUserId(userId);
        
        // Sort milestones by target month
        milestones.sort(Comparator.comparing(LearningRoadmap::getTargetMonth));

        // Get user skills for proficiency lookups
        List<UserSkill> userSkills = userSkillRepository.findByUserId(userId);
        Map<Long, String> userSkillMap = userSkills.stream()
                .collect(Collectors.toMap(us -> us.getSkill().getId(), UserSkill::getProficiency));

        List<RoadmapMilestoneReport> reportList = new ArrayList<>();

        for (LearningRoadmap m : milestones) {
            RoadmapMilestoneReport milestoneReport = new RoadmapMilestoneReport();
            milestoneReport.setId(m.getId());
            milestoneReport.setMilestone(m.getMilestone());
            milestoneReport.setTargetMonth(m.getTargetMonth());
            milestoneReport.setSkillsCovered(m.getSkillsCovered());
            milestoneReport.setCompleted(m.getCompleted());
            milestoneReport.setTargetDate(m.getTargetDate());

            List<RoadmapMilestoneReport.SkillWithResources> skillDetails = new ArrayList<>();

            // Parse covered skill IDs
            if (m.getSkillsCovered() != null && !m.getSkillsCovered().isEmpty()) {
                String[] skillIdsStr = m.getSkillsCovered().split(",");
                for (String sIdStr : skillIdsStr) {
                    try {
                        Long skillId = Long.parseLong(sIdStr.trim());
                        
                        // Resolve the required skill metadata to fetch Name and Category
                        // (Alternatively, we can fetch from a global skills map)
                        RequiredSkill reqSkill = requiredSkillRepository.findAll().stream()
                                .filter(rs -> rs.getCareerRole().getId().equals(user.getDreamRole().getId()) 
                                        && rs.getSkill().getId().equals(skillId))
                                .findFirst()
                                .orElse(null);

                        if (reqSkill != null) {
                            Skill skill = reqSkill.getSkill();
                            String proficiency = userSkillMap.getOrDefault(skillId, "None");

                            // Fetch resources for this skill
                            List<SkillResource> resources = resourceRepository.findBySkillId(skillId);
                            List<RoadmapMilestoneReport.ResourceDetail> resourceDetails = resources.stream()
                                    .map(r -> new RoadmapMilestoneReport.ResourceDetail(r.getResourceName(), r.getResourceUrl(), r.getType()))
                                    .collect(Collectors.toList());

                            RoadmapMilestoneReport.SkillWithResources swr = new RoadmapMilestoneReport.SkillWithResources(
                                    skillId,
                                    skill.getSkillName(),
                                    skill.getCategory(),
                                    proficiency,
                                    resourceDetails
                            );
                            skillDetails.add(swr);
                        }
                    } catch (NumberFormatException e) {
                        // Ignore bad format
                    }
                }
            }

            milestoneReport.setSkills(skillDetails);
            reportList.add(milestoneReport);
        }

        return reportList;
    }

    @Transactional
    public LearningRoadmap completeMilestone(Long milestoneId) {
        LearningRoadmap milestone = roadmapRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found with ID: " + milestoneId));

        if (!milestone.getCompleted()) {
            milestone.setCompleted(true);
            roadmapRepository.save(milestone);

            // Award user 100 XP and increment learning streak!
            userService.addXp(milestone.getUser().getId(), 100);
            userService.incrementStreak(milestone.getUser().getId());
        }

        return milestone;
    }
}
