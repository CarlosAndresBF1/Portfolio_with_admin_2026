import { EntitySchema } from 'typeorm';

// ─── Languages ────────────────────────────────────────────────────────────────

export const Language = new EntitySchema({
  name: 'Language',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    code: { type: 'text', unique: true },
    name: { type: 'text' },
  },
  relations: {
    personalInfos: { type: 'one-to-many', target: 'PersonalInfo', inverseSide: 'language' },
    metaSeos: { type: 'one-to-many', target: 'MetaSeo', inverseSide: 'language' },
    navLabels: { type: 'one-to-many', target: 'NavLabel', inverseSide: 'language' },
    aboutSections: { type: 'one-to-many', target: 'AboutSection', inverseSide: 'language' },
    summaryCards: { type: 'one-to-many', target: 'SummaryCard', inverseSide: 'language' },
    experienceTranslations: {
      type: 'one-to-many',
      target: 'ExperienceTranslation',
      inverseSide: 'language',
    },
    skillCategoryTranslations: {
      type: 'one-to-many',
      target: 'SkillCategoryTranslation',
      inverseSide: 'language',
    },
    skillTranslations: { type: 'one-to-many', target: 'SkillTranslation', inverseSide: 'language' },
    marqueeItems: { type: 'one-to-many', target: 'MarqueeItem', inverseSide: 'language' },
    projectTranslations: {
      type: 'one-to-many',
      target: 'ProjectTranslation',
      inverseSide: 'language',
    },
    contactSectionTranslations: {
      type: 'one-to-many',
      target: 'ContactSectionTranslation',
      inverseSide: 'language',
    },
    footerTranslations: {
      type: 'one-to-many',
      target: 'FooterTranslation',
      inverseSide: 'language',
    },
  },
});

// ─── Hero / Personal Info ─────────────────────────────────────────────────────

export const PersonalInfo = new EntitySchema({
  name: 'PersonalInfo',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    languageId: { type: 'text', unique: true },
    name: { type: 'text' },
    lastName: { type: 'text' },
    role: { type: 'text' },
    tagline: { type: 'text' },
    switchLang: { type: 'text' },
    updatedAt: { type: 'timestamp', precision: 3, updateDate: true },
  },
  relations: {
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'personalInfos',
    },
  },
});

// ─── SEO Meta ─────────────────────────────────────────────────────────────────

export const MetaSeo = new EntitySchema({
  name: 'MetaSeo',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    languageId: { type: 'text', unique: true },
    title: { type: 'text' },
    description: { type: 'text' },
    updatedAt: { type: 'timestamp', precision: 3, updateDate: true },
  },
  relations: {
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'metaSeos',
    },
  },
});

// ─── Navbar Labels ────────────────────────────────────────────────────────────

export const NavLabel = new EntitySchema({
  name: 'NavLabel',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    languageId: { type: 'text', unique: true },
    home: { type: 'text' },
    about: { type: 'text' },
    experience: { type: 'text' },
    skills: { type: 'text' },
    projects: { type: 'text' },
    contact: { type: 'text' },
    updatedAt: { type: 'timestamp', precision: 3, updateDate: true },
  },
  relations: {
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'navLabels',
    },
  },
});

// ─── About Section ────────────────────────────────────────────────────────────

export const AboutSection = new EntitySchema({
  name: 'AboutSection',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    languageId: { type: 'text', unique: true },
    title: { type: 'text' },
    subtitle: { type: 'text' },
    description: { type: 'text' },
    location: { type: 'text' },
    email: { type: 'text' },
    phone: { type: 'text' },
    updatedAt: { type: 'timestamp', precision: 3, updateDate: true },
  },
  relations: {
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'aboutSections',
    },
    circleItems: {
      type: 'one-to-many',
      target: 'AboutCircleItem',
      inverseSide: 'aboutSection',
    },
  },
});

export const AboutCircleItem = new EntitySchema({
  name: 'AboutCircleItem',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    aboutSectionId: { type: 'text' },
    label: { type: 'text' },
    order: { type: 'int' },
  },
  relations: {
    aboutSection: {
      type: 'many-to-one',
      target: 'AboutSection',
      joinColumn: { name: 'aboutSectionId' },
      onDelete: 'CASCADE',
      inverseSide: 'circleItems',
    },
  },
});

// ─── Summary Cards ────────────────────────────────────────────────────────────

export const SummaryCard = new EntitySchema({
  name: 'SummaryCard',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    languageId: { type: 'text' },
    order: { type: 'int' },
    title: { type: 'text' },
    heading: { type: 'text' },
    text: { type: 'text' },
    updatedAt: { type: 'timestamp', precision: 3, updateDate: true },
  },
  relations: {
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'summaryCards',
    },
  },
});

// ─── Experience ───────────────────────────────────────────────────────────────

export const ExperienceJob = new EntitySchema({
  name: 'ExperienceJob',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    number: { type: 'text' },
    company: { type: 'text' },
    periodStart: { type: 'text' },
    periodEnd: { type: 'text' },
    order: { type: 'int' },
    createdAt: { type: 'timestamp', precision: 3, createDate: true },
    updatedAt: { type: 'timestamp', precision: 3, updateDate: true },
  },
  relations: {
    translations: {
      type: 'one-to-many',
      target: 'ExperienceTranslation',
      inverseSide: 'job',
    },
    stack: {
      type: 'one-to-many',
      target: 'ExperienceStack',
      inverseSide: 'job',
    },
  },
});

export const ExperienceTranslation = new EntitySchema({
  name: 'ExperienceTranslation',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    jobId: { type: 'text' },
    languageId: { type: 'text' },
    role: { type: 'text' },
    summary: { type: 'text' },
    details: { type: 'text' },
  },
  relations: {
    job: {
      type: 'many-to-one',
      target: 'ExperienceJob',
      joinColumn: { name: 'jobId' },
      onDelete: 'CASCADE',
      inverseSide: 'translations',
    },
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'experienceTranslations',
    },
  },
  uniques: [{ columns: ['jobId', 'languageId'] }],
});

export const ExperienceStack = new EntitySchema({
  name: 'ExperienceStack',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    jobId: { type: 'text' },
    tech: { type: 'text' },
    order: { type: 'int', default: 0 },
  },
  relations: {
    job: {
      type: 'many-to-one',
      target: 'ExperienceJob',
      joinColumn: { name: 'jobId' },
      onDelete: 'CASCADE',
      inverseSide: 'stack',
    },
  },
});

// ─── Skills ───────────────────────────────────────────────────────────────────

export const SkillCategory = new EntitySchema({
  name: 'SkillCategory',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    order: { type: 'int' },
    createdAt: { type: 'timestamp', precision: 3, createDate: true },
  },
  relations: {
    translations: {
      type: 'one-to-many',
      target: 'SkillCategoryTranslation',
      inverseSide: 'category',
    },
    skills: {
      type: 'one-to-many',
      target: 'Skill',
      inverseSide: 'category',
    },
  },
});

export const SkillCategoryTranslation = new EntitySchema({
  name: 'SkillCategoryTranslation',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    categoryId: { type: 'text' },
    languageId: { type: 'text' },
    name: { type: 'text' },
  },
  relations: {
    category: {
      type: 'many-to-one',
      target: 'SkillCategory',
      joinColumn: { name: 'categoryId' },
      onDelete: 'CASCADE',
      inverseSide: 'translations',
    },
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'skillCategoryTranslations',
    },
  },
  uniques: [{ columns: ['categoryId', 'languageId'] }],
});

export const Skill = new EntitySchema({
  name: 'Skill',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    categoryId: { type: 'text' },
    order: { type: 'int' },
    years: { type: 'text' },
    createdAt: { type: 'timestamp', precision: 3, createDate: true },
  },
  relations: {
    category: {
      type: 'many-to-one',
      target: 'SkillCategory',
      joinColumn: { name: 'categoryId' },
      onDelete: 'CASCADE',
      inverseSide: 'skills',
    },
    translations: {
      type: 'one-to-many',
      target: 'SkillTranslation',
      inverseSide: 'skill',
    },
    workplaces: {
      type: 'one-to-many',
      target: 'SkillWorkplace',
      inverseSide: 'skill',
    },
  },
});

export const SkillTranslation = new EntitySchema({
  name: 'SkillTranslation',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    skillId: { type: 'text' },
    languageId: { type: 'text' },
    name: { type: 'text' },
    description: { type: 'text' },
  },
  relations: {
    skill: {
      type: 'many-to-one',
      target: 'Skill',
      joinColumn: { name: 'skillId' },
      onDelete: 'CASCADE',
      inverseSide: 'translations',
    },
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'skillTranslations',
    },
  },
  uniques: [{ columns: ['skillId', 'languageId'] }],
});

export const SkillWorkplace = new EntitySchema({
  name: 'SkillWorkplace',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    skillId: { type: 'text' },
    workplace: { type: 'text' },
    order: { type: 'int', default: 0 },
  },
  relations: {
    skill: {
      type: 'many-to-one',
      target: 'Skill',
      joinColumn: { name: 'skillId' },
      onDelete: 'CASCADE',
      inverseSide: 'workplaces',
    },
  },
});

// ─── Marquee (hero animation) ─────────────────────────────────────────────────

export const MarqueeItem = new EntitySchema({
  name: 'MarqueeItem',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    languageId: { type: 'text' },
    text: { type: 'text' },
    order: { type: 'int' },
  },
  relations: {
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'marqueeItems',
    },
  },
});

// ─── Projects ─────────────────────────────────────────────────────────────────

export const Project = new EntitySchema({
  name: 'Project',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    order: { type: 'int' },
    createdAt: { type: 'timestamp', precision: 3, createDate: true },
    updatedAt: { type: 'timestamp', precision: 3, updateDate: true },
  },
  relations: {
    translations: {
      type: 'one-to-many',
      target: 'ProjectTranslation',
      inverseSide: 'project',
    },
    stack: {
      type: 'one-to-many',
      target: 'ProjectStack',
      inverseSide: 'project',
    },
  },
});

export const ProjectTranslation = new EntitySchema({
  name: 'ProjectTranslation',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    projectId: { type: 'text' },
    languageId: { type: 'text' },
    title: { type: 'text' },
    description: { type: 'text' },
  },
  relations: {
    project: {
      type: 'many-to-one',
      target: 'Project',
      joinColumn: { name: 'projectId' },
      onDelete: 'CASCADE',
      inverseSide: 'translations',
    },
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'projectTranslations',
    },
  },
  uniques: [{ columns: ['projectId', 'languageId'] }],
});

export const ProjectStack = new EntitySchema({
  name: 'ProjectStack',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    projectId: { type: 'text' },
    tech: { type: 'text' },
    order: { type: 'int', default: 0 },
  },
  relations: {
    project: {
      type: 'many-to-one',
      target: 'Project',
      joinColumn: { name: 'projectId' },
      onDelete: 'CASCADE',
      inverseSide: 'stack',
    },
  },
});

// ─── Contact Section (textos UI del formulario) ───────────────────────────────

export const ContactSectionTranslation = new EntitySchema({
  name: 'ContactSectionTranslation',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    languageId: { type: 'text', unique: true },
    title: { type: 'text' },
    titleHighlight: { type: 'text' },
    subtitle: { type: 'text' },
    formName: { type: 'text' },
    formEmail: { type: 'text' },
    formSubject: { type: 'text' },
    formMessage: { type: 'text' },
    formSend: { type: 'text' },
    formSending: { type: 'text' },
    formSuccess: { type: 'text' },
    formError: { type: 'text' },
    updatedAt: { type: 'timestamp', precision: 3, updateDate: true },
  },
  relations: {
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'contactSectionTranslations',
    },
  },
});

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FooterTranslation = new EntitySchema({
  name: 'FooterTranslation',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    languageId: { type: 'text', unique: true },
    name: { type: 'text' },
    email: { type: 'text' },
    updatedAt: { type: 'timestamp', precision: 3, updateDate: true },
  },
  relations: {
    language: {
      type: 'many-to-one',
      target: 'Language',
      joinColumn: { name: 'languageId' },
      inverseSide: 'footerTranslations',
    },
  },
});

// ─── Contact Form Submissions ─────────────────────────────────────────────────

export const ContactSubmission = new EntitySchema({
  name: 'ContactSubmission',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    name: { type: 'text' },
    email: { type: 'text' },
    subject: { type: 'text' },
    message: { type: 'text' },
    ipAddress: { type: 'text', nullable: true },
    read: { type: 'boolean', default: false },
    createdAt: { type: 'timestamp', precision: 3, createDate: true },
  },
});

// ─── Admin Users (NextAuth) ───────────────────────────────────────────────────

export const User = new EntitySchema({
  name: 'User',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    name: { type: 'text', nullable: true },
    email: { type: 'text', nullable: true, unique: true },
    emailVerified: { type: 'timestamp', precision: 3, nullable: true },
    image: { type: 'text', nullable: true },
    password: { type: 'text', nullable: true },
  },
  relations: {
    accounts: {
      type: 'one-to-many',
      target: 'Account',
      inverseSide: 'user',
    },
    sessions: {
      type: 'one-to-many',
      target: 'Session',
      inverseSide: 'user',
    },
  },
});

export const Account = new EntitySchema({
  name: 'Account',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    userId: { type: 'text' },
    type: { type: 'text' },
    provider: { type: 'text' },
    providerAccountId: { type: 'text' },
    refresh_token: { type: 'text', nullable: true },
    access_token: { type: 'text', nullable: true },
    expires_at: { type: 'int', nullable: true },
    token_type: { type: 'text', nullable: true },
    scope: { type: 'text', nullable: true },
    id_token: { type: 'text', nullable: true },
    session_state: { type: 'text', nullable: true },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId' },
      onDelete: 'CASCADE',
      inverseSide: 'accounts',
    },
  },
  uniques: [{ columns: ['provider', 'providerAccountId'] }],
});

export const Session = new EntitySchema({
  name: 'Session',
  columns: {
    id: { type: 'text', primary: true, generated: 'uuid' },
    sessionToken: { type: 'text', unique: true },
    userId: { type: 'text' },
    expires: { type: 'timestamp', precision: 3 },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId' },
      onDelete: 'CASCADE',
      inverseSide: 'sessions',
    },
  },
});

export const VerificationToken = new EntitySchema({
  name: 'VerificationToken',
  columns: {
    identifier: { type: 'text', primary: true },
    token: { type: 'text', primary: true },
    expires: { type: 'timestamp', precision: 3 },
  },
  uniques: [{ columns: ['identifier', 'token'] }],
});

// ─── All entities (for DataSource) ────────────────────────────────────────────

export const allEntities = [
  Language,
  PersonalInfo,
  MetaSeo,
  NavLabel,
  AboutSection,
  AboutCircleItem,
  SummaryCard,
  ExperienceJob,
  ExperienceTranslation,
  ExperienceStack,
  SkillCategory,
  SkillCategoryTranslation,
  Skill,
  SkillTranslation,
  SkillWorkplace,
  MarqueeItem,
  Project,
  ProjectTranslation,
  ProjectStack,
  ContactSectionTranslation,
  FooterTranslation,
  ContactSubmission,
  User,
  Account,
  Session,
  VerificationToken,
];
