import { z } from 'zod';
import { SectionType } from '@/types/resume/sections';

// Base section validation
const baseSectionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'personal',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'awards',
    'references',
    'publications'
  ] as const),
  header: z.string().min(1, { message: "Header is required" }),
  isLoading: z.boolean().optional()
});

// Personal section validation
const personalContentSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional()
});

// Summary section validation
const summaryContentSchema = z.object({
  text: z.string().min(1, { message: "Summary text is required" })
});

// Experience section validation
const experienceItemSchema = z.object({
  company: z.string().min(1, { message: "Company name is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  isCurrentRole: z.boolean().optional(),
  highlights: z.array(z.string())
});

// Education section validation
const educationItemSchema = z.object({
  institution: z.string().min(1, { message: "Institution name is required" }),
  degree: z.string().min(1, { message: "Degree is required" }),
  field: z.string().min(1, { message: "Field of study is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  gpa: z.string().optional(),
  highlights: z.array(z.string()).optional()
});

// Skills section validation
const skillItemSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
  skills: z.array(z.string().min(1, { message: "Skill name is required" }))
});

// Projects section validation
const projectItemSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  technologies: z.array(z.string()),
  url: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).optional()
});

// Certifications section validation
const certificationItemSchema = z.object({
  name: z.string().min(1, { message: "Certification name is required" }),
  issuer: z.string().min(1, { message: "Issuer is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  url: z.string().url().optional(),
  validUntil: z.string().optional()
});

// Languages section validation
const languageItemSchema = z.object({
  language: z.string().min(1, { message: "Language name is required" }),
  proficiency: z.enum(['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'])
});

// Awards section validation
const awardItemSchema = z.object({
  title: z.string().min(1, { message: "Award title is required" }),
  issuer: z.string().min(1, { message: "Issuer is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().optional()
});

// References section validation
const referenceItemSchema = z.object({
  name: z.string().min(1, { message: "Reference name is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  company: z.string().min(1, { message: "Company is required" }),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

// Publications section validation
const publicationItemSchema = z.object({
  title: z.string().min(1, { message: "Publication title is required" }),
  authors: z.array(z.string()),
  publisher: z.string().min(1, { message: "Publisher is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  url: z.string().url().optional(),
  doi: z.string().optional()
});

// Section content schemas
const personalSectionSchema = baseSectionSchema.extend({
  type: z.literal('personal'),
  content: personalContentSchema
});

const summarySectionSchema = baseSectionSchema.extend({
  type: z.literal('summary'),
  content: summaryContentSchema
});

const experienceSectionSchema = baseSectionSchema.extend({
  type: z.literal('experience'),
  content: z.array(experienceItemSchema)
});

const educationSectionSchema = baseSectionSchema.extend({
  type: z.literal('education'),
  content: z.array(educationItemSchema)
});

const skillsSectionSchema = baseSectionSchema.extend({
  type: z.literal('skills'),
  content: z.array(skillItemSchema)
});

const projectsSectionSchema = baseSectionSchema.extend({
  type: z.literal('projects'),
  content: z.array(projectItemSchema)
});

const certificationsSectionSchema = baseSectionSchema.extend({
  type: z.literal('certifications'),
  content: z.array(certificationItemSchema)
});

const languagesSectionSchema = baseSectionSchema.extend({
  type: z.literal('languages'),
  content: z.array(languageItemSchema)
});

const awardsSectionSchema = baseSectionSchema.extend({
  type: z.literal('awards'),
  content: z.array(awardItemSchema)
});

const referencesSectionSchema = baseSectionSchema.extend({
  type: z.literal('references'),
  content: z.array(referenceItemSchema)
});

const publicationsSectionSchema = baseSectionSchema.extend({
  type: z.literal('publications'),
  content: z.array(publicationItemSchema)
});

// Resume section schema
export const resumeSectionSchema = z.discriminatedUnion('type', [
  personalSectionSchema,
  summarySectionSchema,
  experienceSectionSchema,
  educationSectionSchema,
  skillsSectionSchema,
  projectsSectionSchema,
  certificationsSectionSchema,
  languagesSectionSchema,
  awardsSectionSchema,
  referencesSectionSchema,
  publicationsSectionSchema
]);

// Complete resume schema
export const resumeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, { message: "Title is required" }),
  sections: z.array(resumeSectionSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  score: z.number().int().optional(),
  keywords: z.array(z.string()).optional(),
  targetJobDescriptions: z.array(z.string()).optional(),
});

export type ResumeFormData = z.infer<typeof resumeSchema>;
export type ResumeSectionData = z.infer<typeof resumeSectionSchema>;
