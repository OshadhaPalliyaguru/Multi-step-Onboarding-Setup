import { useState, type FormEvent } from 'react';
import type { PersonalInfo, Role, Department } from '../../types';
import { DEPARTMENTS, ROLES } from '../../data/options';
import { hasErrors, validatePersonal, type FieldErrors } from '../../validation';
import { Field } from '../ui/Field';

interface Step1Props {
  value: PersonalInfo;
  onChange: (next: PersonalInfo) => void;
  onNext: () => void;
}

export function Step1PersonalInfo({ value, onChange, onNext }: Step1Props) {
  const [errors, setErrors] = useState<FieldErrors<PersonalInfo>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof PersonalInfo>(key: K, next: PersonalInfo[K]) => {
    const updated = { ...value, [key]: next };
    onChange(updated);
    if (submitted) {
      setErrors(validatePersonal(updated));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validatePersonal(value);
    setErrors(nextErrors);
    setSubmitted(true);
    if (!hasErrors(nextErrors)) onNext();
  };

  return (
    <form className="step" onSubmit={handleSubmit} noValidate>
      <header className="step__header">
        <p className="step__eyebrow">Step 1 of 3</p>
        <h2 className="step__title">Personal information</h2>
        <p className="step__lede">Tell us about the new team member.</p>
      </header>

      <div className="step__grid">
        <Field label="Full name" required error={errors.fullName}>
          {({ inputId, describedBy }) => (
            <input
              id={inputId}
              type="text"
              autoComplete="name"
              className="input"
              value={value.fullName}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={describedBy}
              onChange={(e) => update('fullName', e.target.value)}
              placeholder="Jane Doe"
            />
          )}
        </Field>

        <Field label="Email address" required error={errors.email}>
          {({ inputId, describedBy }) => (
            <input
              id={inputId}
              type="email"
              autoComplete="email"
              inputMode="email"
              className="input"
              value={value.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy}
              onChange={(e) => update('email', e.target.value)}
              placeholder="jane@company.com"
            />
          )}
        </Field>

        <Field label="Role" required error={errors.role}>
          {({ inputId, describedBy }) => (
            <select
              id={inputId}
              className="input"
              value={value.role}
              aria-invalid={Boolean(errors.role)}
              aria-describedby={describedBy}
              onChange={(e) => update('role', e.target.value as Role | '')}
            >
              <option value="">Select a role…</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Department" required error={errors.department}>
          {({ inputId, describedBy }) => (
            <select
              id={inputId}
              className="input"
              value={value.department}
              aria-invalid={Boolean(errors.department)}
              aria-describedby={describedBy}
              onChange={(e) => update('department', e.target.value as Department | '')}
            >
              <option value="">Select a department…</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <footer className="step__footer">
        <span aria-hidden="true" />
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
