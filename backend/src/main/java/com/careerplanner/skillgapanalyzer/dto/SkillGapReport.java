package com.careerplanner.skillgapanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapReport {
    private Long userId;
    private String userName;
    private String dreamRole;
    private Integer readinessScore;
    private Integer matchPercentage;
    private Integer missingSkillsCount;
    private List<SkillDetail> strongSkills;
    private List<SkillDetail> weakSkills;
    private List<SkillDetail> missingSkills;
    private List<ChartDataPoint> chartData;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillDetail {
        private Long skillId;
        private String skillName;
        private String category;
        private String proficiency;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartDataPoint {
        private String skillName;
        private Integer requiredLevel; // Standard target scale 1-10 (e.g. Core=9, Optional=6)
        private Integer userLevel;     // User scale 1-10 (Advanced=10, Intermediate=7, Beginner=3, Missing=0)
    }
}
