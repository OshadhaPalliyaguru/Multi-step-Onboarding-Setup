export type Role = 'Designer' | 'Developer' | 'QA Engineer' | 'Project Manager';

export type Department = 'Engineering' | 'Design' | 'Delivery' | 'Operations';

export interface PersonalInfo {
  fullName: string;
  email: string;
  role: Role | '';
  department: Department | '';
}

export interface AvatarFile {
  file: File;
  previewUrl: string;
}

export interface SkillsAvatar {
  avatar: AvatarFile | null;
  skills: string[];
}

export interface WizardData {
  personal: PersonalInfo;
  skillsAvatar: SkillsAvatar;
}

export type StepId = 1 | 2 | 3;
