package com.careerplanner.skillgapanalyzer.service;

import com.careerplanner.skillgapanalyzer.dto.SkillGapReport;
import com.careerplanner.skillgapanalyzer.model.RequiredSkill;
import com.careerplanner.skillgapanalyzer.model.User;
import com.careerplanner.skillgapanalyzer.model.UserSkill;
import com.careerplanner.skillgapanalyzer.repository.RequiredSkillRepository;
import com.careerplanner.skillgapanalyzer.repository.UserRepository;
import com.careerplanner.skillgapanalyzer.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequiredSkillRepository requiredSkillRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    public SkillGapReport generateReport(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        SkillGapReport report = new SkillGapReport();
        report.setUserId(user.getId());
        report.setUserName(user.getName());

        if (user.getDreamRole() == null) {
            report.setDreamRole("Not Selected");
            report.setReadinessScore(0);
            report.setMatchPercentage(0);
            report.setMissingSkillsCount(0);
            report.setStrongSkills(new ArrayList<>());
            report.setWeakSkills(new ArrayList<>());
            report.setMissingSkills(new ArrayList<>());
            report.setChartData(new ArrayList<>());
            return report;
        }

        report.setDreamRole(user.getDreamRole().getRoleName());

        // 1. Fetch required skills
        List<RequiredSkill> requiredSkills = requiredSkillRepository.findByCareerRoleId(user.getDreamRole().getId());

        // 2. Fetch user skills and map by skill ID
        List<UserSkill> userSkills = userSkillRepository.findByUserId(userId);
        Map<Long, UserSkill> userSkillMap = userSkills.stream()
                .collect(Collectors.toMap(us -> us.getSkill().getId(), us -> us));

        List<SkillGapReport.SkillDetail> strongSkills = new ArrayList<>();
        List<SkillGapReport.SkillDetail> weakSkills = new ArrayList<>();
        List<SkillGapReport.SkillDetail> missingSkills = new ArrayList<>();
        List<SkillGapReport.ChartDataPoint> chartData = new ArrayList<>();

        double totalScoreWeight = 0.0;
        int matchCount = 0;

        for (RequiredSkill req : requiredSkills) {
            Long skillId = req.getSkill().getId();
            String skillName = req.getSkill().getSkillName();
            String category = req.getSkill().getCategory();
            
            // Set required level on a 1-10 scale based on importance
            int reqLevel = req.getImportance().equalsIgnoreCase("Core") ? 9 : 6;
            int userLevel = 0;
            double skillWeight = 0.0;
            String userProficiency = null;

            if (userSkillMap.containsKey(skillId)) {
                UserSkill us = userSkillMap.get(skillId);
                userProficiency = us.getProficiency();
                matchCount++;

                SkillGapReport.SkillDetail detail = new SkillGapReport.SkillDetail(
                        skillId, skillName, category, userProficiency
                );

                if (userProficiency.equalsIgnoreCase("Advanced")) {
                    userLevel = 10;
                    skillWeight = 1.0;
                    strongSkills.add(detail);
                } else if (userProficiency.equalsIgnoreCase("Intermediate")) {
                    userLevel = 7;
                    skillWeight = 0.7;
                    strongSkills.add(detail);
                } else { // Beginner
                    userLevel = 3;
                    skillWeight = 0.3;
                    weakSkills.add(detail);
                }
            } else {
                // Missing skill
                SkillGapReport.SkillDetail detail = new SkillGapReport.SkillDetail(
                        skillId, skillName, category, "None"
                );
                missingSkills.add(detail);
            }

            totalScoreWeight += skillWeight;
            chartData.add(new SkillGapReport.ChartDataPoint(skillName, reqLevel, userLevel));
        }

        int totalRequiredCount = requiredSkills.size();
        int matchPercentage = totalRequiredCount == 0 ? 0 : (int) Math.round(((double) matchCount / totalRequiredCount) * 100);
        int readinessScore = totalRequiredCount == 0 ? 0 : (int) Math.round((totalScoreWeight / totalRequiredCount) * 100);

        report.setStrongSkills(strongSkills);
        report.setWeakSkills(weakSkills);
        report.setMissingSkills(missingSkills);
        report.setChartData(chartData);
        report.setMatchPercentage(matchPercentage);
        report.setReadinessScore(readinessScore);
        report.setMissingSkillsCount(missingSkills.size());

        return report;
    }
}
