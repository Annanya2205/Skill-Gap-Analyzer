package com.careerplanner.skillgapanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapMilestoneReport {
    private Long id;
    private String milestone;
    private Integer targetMonth;
    private String skillsCovered;
    private Boolean completed;
    private LocalDate targetDate;
    private List<SkillWithResources> skills;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillWithResources {
        private Long skillId;
        private String skillName;
        private String category;
        private String proficiency;
        private List<ResourceDetail> resources;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResourceDetail {
        private String name;
        private String url;
        private String type;
    }
}
