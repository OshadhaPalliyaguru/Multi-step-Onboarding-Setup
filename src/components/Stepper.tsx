import type { StepId } from '../types';

interface StepperProps {
  current: StepId;
  highestCompleted: number;
  steps: { id: StepId; label: string }[];
  onJump: (id: StepId) => void;
}

export function Stepper({ current, highestCompleted, steps, onJump }: StepperProps) {
  return (
    <nav aria-label="Onboarding progress" className="stepper">
      <ol className="stepper__list">
        {steps.map((step, index) => {
          const isActive = step.id === current;
          const isComplete = step.id < current || step.id <= highestCompleted;
          const isReachable = step.id <= Math.max(current, highestCompleted + 1);

          return (
            <li key={step.id} className="stepper__item">
              <button
                type="button"
                className={`stepper__node ${isActive ? 'is-active' : ''} ${
                  isComplete ? 'is-complete' : ''
                }`}
                onClick={() => isReachable && onJump(step.id)}
                disabled={!isReachable}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${step.id} of ${steps.length}: ${step.label}${
                  isComplete ? ' (completed)' : ''
                }`}
              >
                <span className="stepper__circle">
                  {isComplete && !isActive ? (
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path
                        d="M3.5 8.5l3 3 6-6.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </span>
                <span className="stepper__label">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <span
                  className={`stepper__connector ${
                    step.id <= highestCompleted ? 'is-complete' : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
