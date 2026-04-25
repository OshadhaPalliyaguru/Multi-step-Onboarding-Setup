import type { PersonalInfo, SkillsAvatar } from './types';

export const MAX_AVATAR_BYTES = 3 * 1024 * 1024;
export const ACCEPTED_AVATAR_TYPES = ['image/jpeg', 'image/png'];
export const ACCEPTED_AVATAR_EXTS = ['.jpg', '.jpeg', '.png'];
export const MIN_SKILLS = 2;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validatePersonal(info: PersonalInfo): FieldErrors<PersonalInfo> {
  const errors: FieldErrors<PersonalInfo> = {};

  if (!info.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (info.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!info.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(info.email.trim())) {
    errors.email = 'Enter a valid email address (e.g. you@company.com).';
  }

  if (!info.role) {
    errors.role = 'Please select a role.';
  }

  if (!info.department) {
    errors.department = 'Please select a department.';
  }

  return errors;
}

export interface AvatarValidationOk {
  ok: true;
}
export interface AvatarValidationErr {
  ok: false;
  message: string;
}
export type AvatarValidation = AvatarValidationOk | AvatarValidationErr;

export function validateAvatarFile(file: File): AvatarValidation {
  const lowerName = file.name.toLowerCase();
  const extOk = ACCEPTED_AVATAR_EXTS.some((ext) => lowerName.endsWith(ext));
  const typeOk = ACCEPTED_AVATAR_TYPES.includes(file.type);

  if (!extOk || !typeOk) {
    return {
      ok: false,
      message: 'Unsupported file type. Please upload a .jpg, .jpeg, or .png image.',
    };
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return {
      ok: false,
      message: 'File is too large. Maximum size is 3 MB.',
    };
  }

  return { ok: true };
}

export type SkillsAvatarErrors = {
  avatar?: string;
  skills?: string;
} & Record<string, string | undefined>;

export function validateSkillsAvatar(state: SkillsAvatar): SkillsAvatarErrors {
  const errors: SkillsAvatarErrors = {};

  if (!state.avatar) {
    errors.avatar = 'Please upload an avatar image.';
  }

  if (state.skills.length < MIN_SKILLS) {
    errors.skills = `Please select at least ${MIN_SKILLS} skills.`;
  }

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
