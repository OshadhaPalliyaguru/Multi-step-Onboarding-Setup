import { useId, type ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: (ids: { inputId: string; errorId: string; describedBy: string | undefined }) => ReactNode;
}

export function Field({ label, error, required, hint, children }: FieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  let describedBy: string | undefined;
  const ids: string[] = [];
  if (error) ids.push(errorId);
  if (hint) ids.push(hintId);
  if (ids.length) describedBy = ids.join(' ');

  return (
    <div className={`field ${error ? 'field--invalid' : ''}`}>
      <label htmlFor={inputId} className="field__label">
        {label}
        {required && <span aria-hidden="true" className="field__required"> *</span>}
      </label>
      {children({ inputId, errorId, describedBy })}
      {hint && !error && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
