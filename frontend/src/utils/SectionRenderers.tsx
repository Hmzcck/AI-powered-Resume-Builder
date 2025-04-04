import React from "react";
import parse from "html-react-parser";
import styles from "@/components/resume-builder/preview/PdfPreview.module.css";
import type { SectionType } from "@/types/resume/sections";

const renderPersonalInfo = (content: string) => {
  try {
    const info = JSON.parse(content);
    return (
      <div className={styles.personalInfo}>
        <div className={styles.name}>{info.name}</div>
        <div className={styles.contactInfo}>
          {[info.email, info.phone, info.location, info.website]
            .filter(Boolean)
            .join(" ")}
        </div>
      </div>
    );
  } catch {
    return null;
  }
};
const renderEducation = (content: string) => {
  try {
    const education = JSON.parse(content);
    const educationArray = Array.isArray(education) ? education : [education];
    
    return (
      <div>
        {educationArray.map((edu, index) => (
          <div
            key={index}
            className={styles.education}
            style={index > 0 ? { marginTop: '1.5rem' } : undefined}
          >
            <div className={styles.schoolName}>{edu.schoolName}</div>
            <div className={styles.degreeAndMajor}>
              {edu.degree} in {edu.major}
            </div>
            <div className={styles.dates}>
              {edu.startDate} - {edu.isCurrentStudent ? "Present" : edu.endDate}
            </div>
            {edu.gpa && <div className={styles.gpa}>GPA: {edu.gpa}</div>}
            <div className={styles.description}>
              {parse(edu.description)}
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return null;
  }
};

const renderExperience = (content: string) => {
  try {
    const experiences = JSON.parse(content);
    const experienceArray = Array.isArray(experiences) ? experiences : [experiences];
    
    return (
      <div>
        {experienceArray.map((experience, index) => (
          <div
            key={index}
            className={styles.experience}
            style={index > 0 ? { marginTop: '1.5rem' } : undefined}
          >
            <div className={styles.jobTitle}>{experience.jobTitle}</div>
            <div className={styles.companyName}>{experience.companyName}</div>
            <div className={styles.dates}>
              {experience.startDate} -{" "}
              {experience.isCurrentJob ? "Present" : experience.endDate}
            </div>
            <div className={styles.description}>
              {parse(experience.description)}
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return null;
  }
};

const renderCertifications = (content: string) => {
  try {
    const certifications = JSON.parse(content);
    const certArray = Array.isArray(certifications) ? certifications : [certifications];
    
    return (
      <div>
        {certArray.map((cert, index) => (
          <div
            key={index}
            className={styles.certification}
            style={index > 0 ? { marginTop: '1.5rem' } : undefined}
          >
            <div className={styles.certName}>{cert.name}</div>
            <div className={styles.certIssuer}>{cert.issuer}</div>
            {cert.link && (
              <div className={styles.certLink}>
                Certificate Link: {cert.link}
              </div>
            )}
            <div className={styles.dates}>
              Earned: {cert.date}
            </div>
            <div className={styles.description}>
              {parse(cert.description)}
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return null;
  }
};

const renderProjects = (content: string) => {
  try {
    const projects = JSON.parse(content);
    const projectArray = Array.isArray(projects) ? projects : [projects];
    
    return (
      <div>
        {projectArray.map((project, index) => (
          <div
            key={index}
            className={styles.project}
            style={index > 0 ? { marginTop: '1.5rem' } : undefined}
          >
            <div className={styles.projectName}>{project.projectName}</div>
            {project.technologies && (
              <div className={styles.technologies}>
                Technologies: {project.technologies}
              </div>
            )}
            <div className={styles.dates}>
              {project.startDate} -{" "}
              {project.isOngoing ? "Present" : project.endDate}
            </div>
            <div className={styles.description}>
              {parse(project.description)}
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return null;
  }
};

const renderAwards = (content: string) => {
  try {
    const awards = JSON.parse(content);
    const awardArray = Array.isArray(awards) ? awards : [awards];
    
    return (
      <div>
        {awardArray.map((award, index) => (
          <div
            key={index}
            className={styles.award}
            style={index > 0 ? { marginTop: '1.5rem' } : undefined}
          >
            <div className={styles.awardName}>{award.name}</div>
            <div className={styles.dates}>Date: {award.date}</div>
            {award.link && (
              <div className={styles.awardLink}>
                Link: {award.link}
              </div>
            )}
            <div className={styles.description}>
              {parse(award.description)}
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return null;
  }
};

const renderLanguages = (content: string) => {
  try {
    const languages = JSON.parse(content);
    const langArray = Array.isArray(languages) ? languages : [languages];
    
    return (
      <div>
        {langArray.map((lang, index) => (
          <div
            key={index}
            className={styles.language}
            style={index > 0 ? { marginTop: '0.75rem' } : undefined}
          >
            <div className={styles.languageName}>{lang.name}</div>
            <div className={styles.proficiency}>{lang.proficiency}</div>
          </div>
        ))}
      </div>
    );
  } catch {
    return null;
  }
};

const renderReferences = (content: string) => {
  try {
    const references = JSON.parse(content);
    const refArray = Array.isArray(references) ? references : [references];
    
    return (
      <div>
        {refArray.map((ref, index) => (
          <div
            key={index}
            className={styles.reference}
            style={index > 0 ? { marginTop: '1.5rem' } : undefined}
          >
            <div className={styles.refName}>{ref.fullName}</div>
            <div className={styles.jobTitle}>{ref.jobTitle}</div>
            <div className={styles.company}>{ref.company}</div>
            <div className={styles.relationship}>
              Relationship: {ref.relationship}
            </div>
            <div className={styles.contactInfo}>
              {ref.email && <span>Email: {ref.email}</span>}
              {ref.phone && <span> • Phone: {ref.phone}</span>}
            </div>
            {ref.additionalInfo && (
              <div className={styles.description}>
                {parse(ref.additionalInfo)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } catch {
    return null;
  }
};

const renderPublications = (content: string) => {
  try {
    const publications = JSON.parse(content);
    const pubArray = Array.isArray(publications) ? publications : [publications];
    
    return (
      <div>
        {pubArray.map((pub, index) => (
          <div
            key={index}
            className={styles.publication}
            style={index > 0 ? { marginTop: '1.5rem' } : undefined}
          >
            <div className={styles.pubTitle}>{pub.title}</div>
            <div className={styles.authors}>{pub.authors}</div>
            <div className={styles.venue}>{pub.venue}</div>
            <div className={styles.dates}>
              Published: {pub.publicationDate}
            </div>
            {pub.doi && (
              <div className={styles.doi}>
                DOI/URL: {pub.doi}
              </div>
            )}
            <div className={styles.description}>
              {parse(pub.description)}
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return null;
  }
};

const renderRichText = (content: string) => {
  return <div>{parse(content)}</div>;
};

const sectionRenderers: Record<
  SectionType,
  (content: string) => React.ReactNode
> = {
  personal: renderPersonalInfo,
  summary: renderRichText,
  experience: renderExperience, // Can be updated to renderStructuredContent when needed
  education: renderEducation,
  skills: renderRichText,
  projects: renderProjects,
  certifications: renderCertifications,
  languages: renderLanguages,
  awards: renderAwards,
  references: renderReferences,
  publications: renderPublications,
};

export const renderSectionContent = (
  type: SectionType,
  content: string
): React.ReactNode => {
  const renderer = sectionRenderers[type];
  if (!renderer) {
    return renderRichText(content); // Fallback to rich text rendering
  }
  return renderer(content);
};