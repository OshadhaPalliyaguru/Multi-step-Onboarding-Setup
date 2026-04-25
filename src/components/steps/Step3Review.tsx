import { useState } from 'react';
import type { StepId, WizardData } from '../../types';

interface Step3Props {
  data: WizardData;
  onBack: () => void;
  onEdit: (step: StepId) => void;
  onSubmit: () => Promise<void> | void;
}

export function Step3Review({ data, onBack, onEdit, onSubmit }: Step3Props) {
  const [submitting, setSubmitting] = useState(false);
  const { personal, skillsAvatar } = data;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="step">
      <header className="step__header">
        <p className="step__eyebrow">Step 3 of 3</p>
        <h2 className="step__title">Review &amp; submit</h2>
        <p className="step__lede">Confirm everything looks right before we add this team member.</p>
      </header>

      <div className="review">
        <article className="review__card">
          <div className="review__card-header">
            <h3>Personal info</h3>
            <button type="button" className="btn btn--text" onClick={() => onEdit(1)}>
              Edit
            </button>
          </div>
          <dl className="review__list">
            <div>
              <dt>Full name</dt>
              <dd>{personal.fullName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{personal.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{personal.role}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{personal.department}</dd>
            </div>
          </dl>
        </article>

        <article className="review__card">
          <div className="review__card-header">
            <h3>Skills &amp; avatar</h3>
            <button type="button" className="btn btn--text" onClick={() => onEdit(2)}>
              Edit
            </button>
          </div>
          <div className="review__avatar-row">
            {skillsAvatar.avatar && (
              <div className="avatar-preview has-image avatar-preview--sm">
                <img src={skillsAvatar.avatar.previewUrl} alt={`Avatar for ${personal.fullName}`} />
              </div>
            )}
            <div>
              <p className="review__filename">
                {skillsAvatar.avatar?.file.name}
                {skillsAvatar.avatar &&
                  ` · ${(skillsAvatar.avatar.file.size / 1024).toFixed(0)} KB`}
              </p>
              <ul className="review__chips">
                {skillsAvatar.skills.map((s) => (
                  <li key={s} className="chip chip--static">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>

      <footer className="step__footer">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onBack}
          disabled={submitting}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </footer>
    </div>
  );
}
