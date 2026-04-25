import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import type { AvatarFile, Role, SkillsAvatar } from '../../types';
import { SKILLS_BY_ROLE } from '../../data/options';
import {
  ACCEPTED_AVATAR_EXTS,
  hasErrors,
  validateAvatarFile,
  validateSkillsAvatar,
  type SkillsAvatarErrors,
} from '../../validation';

interface Step2Props {
  role: Role;
  value: SkillsAvatar;
  onChange: (next: SkillsAvatar) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2SkillsAvatar({ role, value, onChange, onNext, onBack }: Step2Props) {
  const [errors, setErrors] = useState<SkillsAvatarErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputId = useId();
  const avatarErrorId = `${avatarInputId}-error`;
  const skillsLegendId = useId();
  const skillsErrorId = `${skillsLegendId}-error`;

  const availableSkills = SKILLS_BY_ROLE[role];

  const setAvatar = (avatar: AvatarFile | null, avatarError?: string) => {
    if (value.avatar && value.avatar.previewUrl !== avatar?.previewUrl) {
      URL.revokeObjectURL(value.avatar.previewUrl);
    }
    onChange({ ...value, avatar });
    setErrors((prev) => ({ ...prev, avatar: avatarError }));
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = validateAvatarFile(file);
    if (result.ok === false) {
      setAvatar(null, result.message);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatar({ file, previewUrl });
  };

  const removeAvatar = () => {
    setAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleSkill = (skill: string) => {
    const next = value.skills.includes(skill)
      ? value.skills.filter((s) => s !== skill)
      : [...value.skills, skill];
    const updated = { ...value, skills: next };
    onChange(updated);
    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        skills: validateSkillsAvatar(updated).skills,
      }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateSkillsAvatar(value);
    setErrors(nextErrors);
    setSubmitted(true);
    if (!hasErrors(nextErrors)) onNext();
  };

  return (
    <form className="step" onSubmit={handleSubmit} noValidate>
      <header className="step__header">
        <p className="step__eyebrow">Step 2 of 3</p>
        <h2 className="step__title">Skills &amp; avatar</h2>
        <p className="step__lede">
          Available skills are tailored to the <strong>{role}</strong> role.
        </p>
      </header>

      <section className="avatar-section" aria-labelledby={`${avatarInputId}-label`}>
        <h3 id={`${avatarInputId}-label`} className="section__title">
          Avatar <span className="text-required">*</span>
        </h3>
        <p className="section__hint">JPG or PNG, up to 3 MB.</p>

        <div className="avatar-row">
          <div
            className={`avatar-preview ${value.avatar ? 'has-image' : ''}`}
            aria-hidden={!value.avatar}
          >
            {value.avatar ? (
              <img src={value.avatar.previewUrl} alt="Avatar preview" />
            ) : (
              <span className="avatar-preview__placeholder" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path
                    d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-3.5 0-7 1.8-7 4v2h14v-2c0-2.2-3.5-4-7-4z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            )}
          </div>

          <div className="avatar-controls">
            <input
              id={avatarInputId}
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_AVATAR_EXTS.join(',')}
              className="visually-hidden"
              onChange={handleFile}
              aria-invalid={Boolean(errors.avatar)}
              aria-describedby={errors.avatar ? avatarErrorId : undefined}
            />
            <label htmlFor={avatarInputId} className="btn btn--ghost">
              {value.avatar ? 'Replace image' : 'Choose image'}
            </label>
            {value.avatar && (
              <button type="button" className="btn btn--text" onClick={removeAvatar}>
                Remove
              </button>
            )}
            {value.avatar && (
              <p className="avatar-filename" title={value.avatar.file.name}>
                {value.avatar.file.name}
              </p>
            )}
            {errors.avatar && (
              <p id={avatarErrorId} className="field__error" role="alert">
                {errors.avatar}
              </p>
            )}
          </div>
        </div>
      </section>

      <fieldset
        className="skills-section"
        aria-describedby={errors.skills ? skillsErrorId : undefined}
      >
        <legend id={skillsLegendId} className="section__title">
          Skills <span className="text-required">*</span>
        </legend>
        <p className="section__hint">Select at least 2 skills for {role}.</p>

        <div className="skill-grid" role="group" aria-labelledby={skillsLegendId}>
          {availableSkills.map((skill) => {
            const selected = value.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                role="switch"
                aria-checked={selected}
                className={`chip ${selected ? 'is-selected' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                <span className="chip__check" aria-hidden="true">
                  {selected ? (
                    <svg viewBox="0 0 16 16" width="12" height="12">
                      <path
                        d="M3.5 8.5l3 3 6-6.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>
                {skill}
              </button>
            );
          })}
        </div>

        <p className="skill-counter" aria-live="polite">
          {value.skills.length} selected
        </p>

        {errors.skills && (
          <p id={skillsErrorId} className="field__error" role="alert">
            {errors.skills}
          </p>
        )}
      </fieldset>

      <footer className="step__footer">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="btn btn--primary">
          Next
          <svg viewBox="0 0 20 20" aria-hidden="true" width="16" height="16">
            <path
              d="M7 4l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </footer>
    </form>
  );
}
