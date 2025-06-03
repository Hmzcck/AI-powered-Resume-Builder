import React, { JSX } from "react";
import parse from "html-react-parser";
import styles from "@/components/resume-builder/preview/PdfPreview.module.css";
import type { Section } from "@/types/resume/sections";
import type {
  ExperienceDto,
  EducationDto,
  SkillDto,
  ProjectDto,
  CertificationDto,
  LanguageDto,
  AwardDto,
  PublicationDto,
  ReferenceDto,
} from "@/types/resume/models";

type PersonalInfo = {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
};

const renderPersonalInfo = (content: PersonalInfo | string) => {
  if (typeof content === "string") {
    return renderRichText(content);
  }
  return (
    <div className={styles.personalInfo}>
      <div className={styles.name}>{content.name}</div>
      <div className={styles.contactInfo}>
        {[content.email, content.phone, content.location, content.website]
          .filter(Boolean)
          .join(" ")}
      </div>
    </div>
  );
};
const renderEducation = (content: EducationDto[] | string) => {
  if (typeof content === "string") {
    return renderRichText(content);
  }
  return (
    <div>
      {content.map((edu, index) => (
        <div
          key={index}
          className={styles.education}
          style={index > 0 ? { marginTop: "1.5rem" } : undefined}
        >
          <div className={styles.schoolName}>{edu.institution}</div>
          <div className={styles.degreeAndMajor}>
            {edu.degree} in {edu.fieldOfStudy}
          </div>
          <div className={styles.dates}>
            {formatDate(edu.startDate)} -{" "}
            {!edu.endDate ? "Present" : formatDate(edu.endDate)}
          </div>
          {edu.location && (
            <div className={styles.location}>{edu.location}</div>
          )}
          {edu.gpa && <div className={styles.gpa}>GPA: {edu.gpa}</div>}
          {edu.description && (
            <div className={styles.description}>{parse(edu.description)}</div>
          )}
          {edu.achievements && (
            <div className={styles.achievements}>{parse(edu.achievements)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderExperience = (content: ExperienceDto[] | string) => {
  console.log("Experience content editor:", content);
  if (typeof content === "string") {
    return renderRichText(content);
  }
  return (
    <div>
      {content.map((experience, index) => (
        <div
          key={index}
          className={styles.experience}
          style={index > 0 ? { marginTop: "1.5rem" } : undefined}
        >
          <div className={styles.jobTitle}>{experience.position}</div>
          <div className={styles.companyName}>{experience.company}</div>
          {experience.location && (
            <div className={styles.location}>{experience.location}</div>
          )}
          <div className={styles.dates}>
            {formatDate(experience.startDate)} -{" "}
            {!experience.endDate ? "Present" : formatDate(experience.endDate)}
          </div>
          <div className={styles.description}>
            {parse(experience.description)}
          </div>
          {experience.technologies && (
            <div className={styles.technologies}>
              Technologies: {experience.technologies}
            </div>
          )}
          {experience.achievements && (
            <div className={styles.achievements}>
              {parse(experience.achievements)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderCertifications = (content: CertificationDto[] | string) => {
  if (typeof content === "string") {
    return renderRichText(content);
  }
  return (
    <div>
      {content.map((cert, index) => (
        <div
          key={index}
          className={styles.certification}
          style={index > 0 ? { marginTop: "1.5rem" } : undefined}
        >
          <div className={styles.certName}>{cert.name}</div>
          <div className={styles.certIssuer}>{cert.issuingOrganization}</div>
          {cert.credentialUrl && (
            <div className={styles.certLink}>
              Certificate Link: {cert.credentialUrl}
            </div>
          )}
          <div className={styles.dates}>
            Earned: {formatDate(cert.issueDate)}
            {cert.expiryDate && ` (Expires: ${formatDate(cert.expiryDate)})`}
          </div>
          {cert.credentialId && (
            <div className={styles.credentialId}>
              Credential ID: {cert.credentialId}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderProjects = (content: ProjectDto[] | string) => {
  if (typeof content === "string") {
    return renderRichText(content);
  }
  return (
    <div>
      {content.map((project, index) => (
        <div
          key={index}
          className={styles.project}
          style={index > 0 ? { marginTop: "1.5rem" } : undefined}
        >
          <div className={styles.projectName}>{project.name}</div>
          {project.technologies && (
            <div className={styles.technologies}>
              Technologies: {project.technologies}
            </div>
          )}
          {(project.startDate || project.endDate) && (
            <div className={styles.dates}>
              {project.startDate ? formatDate(project.startDate) : ""} -{" "}
              {!project.endDate ? "Present" : formatDate(project.endDate)}
            </div>
          )}
          <div className={styles.description}>{parse(project.description)}</div>
          {project.link && (
            <div className={styles.projectLink}>
              Project Link: {project.link}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderAwards = (content: AwardDto[] | string) => {
  if (typeof content === "string") {
    return renderRichText(content);
  }
  return (
    <div>
      {content.map((award, index) => (
        <div
          key={index}
          className={styles.award}
          style={index > 0 ? { marginTop: "1.5rem" } : undefined}
        >
          <div className={styles.awardName}>{award.title}</div>
          <div className={styles.issuer}>{award.issuingOrganization}</div>
          {award.category && (
            <div className={styles.category}>Category: {award.category}</div>
          )}
          <div className={styles.dates}>
            Date Received: {formatDate(award.dateReceived)}
          </div>
          {award.level && (
            <div className={styles.level}>Level: {award.level}</div>
          )}
          {award.url && (
            <div className={styles.awardLink}>Link: {award.url}</div>
          )}
          {award.description && (
            <div className={styles.description}>{parse(award.description)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderLanguages = (content: LanguageDto[] | string) => {
  if (typeof content === "string") {
    return renderRichText(content);
  }
  return (
    <div>
      {content.map((lang, index) => (
        <div
          key={index}
          className={styles.language}
          style={index > 0 ? { marginTop: "0.75rem" } : undefined}
        >
          <div className={styles.languageName}>{lang.name}</div>
          <div className={styles.proficiency}>{lang.proficiencyLevel}</div>
          {lang.certification && (
            <div className={styles.certification}>
              Certification: {lang.certification}
            </div>
          )}
          {lang.additionalInfo && (
            <div className={styles.additionalInfo}>{lang.additionalInfo}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderReferences = (content: ReferenceDto[] | string) => {
  if (typeof content === "string") {
    return renderRichText(content);
  }
  return (
    <div>
      {content.map((ref, index) => (
        <div
          key={index}
          className={styles.reference}
          style={index > 0 ? { marginTop: "1.5rem" } : undefined}
        >
          <div className={styles.refName}>{ref.name}</div>
          <div className={styles.jobTitle}>{ref.position}</div>
          <div className={styles.company}>{ref.company}</div>
          {ref.relationship && (
            <div className={styles.relationship}>
              Relationship: {ref.relationship}
            </div>
          )}
          {ref.description && (
            <div className={styles.description}>{parse(ref.description)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderPublications = (content: PublicationDto[] | string) => {
  if (typeof content === "string") {
    return renderRichText(content);
  }
  return (
    <div>
      {content.map((pub, index) => (
        <div
          key={index}
          className={styles.publication}
          style={index > 0 ? { marginTop: "1.5rem" } : undefined}
        >
          <div className={styles.pubTitle}>{pub.title}</div>
          {pub.authors && <div className={styles.authors}>{pub.authors}</div>}
          {pub.publisher && <div className={styles.venue}>{pub.publisher}</div>}
          <div className={styles.dates}>
            Published: {formatDate(pub.publicationDate)}
          </div>
          {pub.type && <div className={styles.type}>Type: {pub.type}</div>}
          {(pub.doi || pub.url) && (
            <div className={styles.doi}>
              {pub.doi ? `DOI: ${pub.doi}` : `URL: ${pub.url}`}
            </div>
          )}
          {pub.citation && (
            <div className={styles.citation}>Citation: {pub.citation}</div>
          )}
          {pub.impact && (
            <div className={styles.impact}>Impact: {pub.impact}</div>
          )}
          {pub.description && (
            <div className={styles.description}>{parse(pub.description)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderRichText = (content: string) => {
  return <div>{parse(content)}</div>;
};

const renderSkills = (content: SkillDto[] | string) => {
  console.log("Skills content received:", content);
  
  // If content is a string, render it directly as rich text (most common case with our SkillsEditor)
  if (typeof content === "string") {
    try {
      return renderRichText(content);
    } catch (error) {
      console.error("Error parsing skills HTML content:", error);
      return <div className="skills-plain-text">{content}</div>;
    }
  }

  // Legacy support for SkillDto[] format
  if (Array.isArray(content) && content.length > 0) {
    try {
      // Group skills by category
      const groupedSkills = content.reduce((acc, skill) => {
        if (!skill) return acc;
        
        const category = skill.category || "";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      }, {} as Record<string, SkillDto[]>);
      
      // Render grouped skills
      return (
        <div>
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className={styles.skillCategory}>
              <div className={styles.categoryName}>{category}</div>
              <div className={styles.skillList}>
                {skills.map((skill) => (
                  <div key={`${category}-${skill.name || "unnamed"}`} className={styles.skill}>
                    <div className={styles.skillName}>
                      {skill.name || ""}
                      {skill.yearsOfExperience > 0 && 
                        ` (${skill.yearsOfExperience}+ years)`}
                    </div>
                    {skill.proficiencyLevel && (
                      <div className={styles.proficiencyLevel}>
                        Level: {skill.proficiencyLevel}/5
                      </div>
                    )}
                    {skill.description && (
                      <div className={styles.skillDescription}>
                        {skill.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );      } catch (error) {
      console.error("Error rendering skills array:", error);
      // Try to convert the array to a string representation
      const formattedContent = content.reduce((acc, skill) => {
        if (!skill?.name) return acc;
        const category = skill.category || "";
        
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill.name);
        return acc;
      }, {} as Record<string, string[]>);
      
      // Convert the grouped format to HTML
      const htmlContent = Object.entries(formattedContent)
        .map(([category, skillNames]) => 
          `<p><strong>${category}:</strong> ${skillNames.join(', ')}</p>`
        )
        .join('');
        
      return renderRichText(htmlContent);
    }
  }
  
  // If content is empty or not in a recognized format
  return <div className="skills-empty">No skills listed</div>;
};

// Helper function to format dates consistently
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const renderSection = (section: Section): React.ReactNode => {
  switch (section.type) {
    case "personal":
      return renderPersonalInfo(section.content);
    case "summary":
      return renderRichText(section.content);
    case "experience":
      return renderExperience(section.content);
    case "education":
      return renderEducation(section.content);
    case "skills":
      return renderSkills(section.content);
    case "projects":
      return renderProjects(section.content);
    case "certifications":
      return renderCertifications(section.content);
    case "languages":
      return renderLanguages(section.content);
    case "awards":
      return renderAwards(section.content);
    case "references":
      return renderReferences(section.content);
    case "publications":
      return renderPublications(section.content);
    default:
      return null;
  }
};

export function renderSectionContent(section: Section): JSX.Element {
  return <>{renderSection(section)}</>;
}
