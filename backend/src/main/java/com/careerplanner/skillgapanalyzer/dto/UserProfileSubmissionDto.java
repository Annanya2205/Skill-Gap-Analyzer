package com.careerplanner.skillgapanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileSubmissionDto {
    private String name;
    private String education;
    private String college;
    private Integer graduationYear;
    private Long dreamRoleId;
    private List<SkillAssessment> skills;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillAssessment {
        private Long skillId;
        private String proficiency; // Beginner, Intermediate, Advanced
    }
}
