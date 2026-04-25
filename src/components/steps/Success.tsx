import type { WizardData } from '../../types';

interface SuccessProps {
  data: WizardData;
}

export function Success({ data }: SuccessProps) {
  const firstName = data.personal.fullName.trim().split(/\s+/)[0];

  return (
    <div className="success" role="status" aria-live="polite">
      <div className="success__badge" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="34" height="34">
          <path
            d="M8 16.5l5 5 11-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="success__title">Welcome aboard, {firstName}!</h2>
      <p className="success__lede">
        {data.personal.fullName} has been added to <strong>{data.personal.department}</strong> as a{' '}
        <strong>{data.personal.role}</strong>.
      </p>
      <p className="success__note">A confirmation has been sent to {data.personal.email}.</p>
    </div>
  );
}
