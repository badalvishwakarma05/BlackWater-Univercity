import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { Skull } from "lucide-react";

interface FieldChrome {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  dark?: boolean;
  className?: string;
}

function describedBy(hintId: string, errorId: string, hint?: ReactNode, error?: string) {
  return [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
}

function Messages({ hintId, errorId, hint, error }: { hintId: string; errorId: string; hint?: ReactNode; error?: string }) {
  return (
    <>
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error">
          <Skull size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </>
  );
}

type TextFieldProps = FieldChrome & Omit<ComponentPropsWithRef<"input">, "className">;

export function TextField({ label, hint, error, dark, className = "", id, ...rest }: TextFieldProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <input
        id={fieldId}
        className={`pirate-input ${dark ? "dark" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId, hint, error)}
        {...rest}
      />
      <Messages hintId={hintId} errorId={errorId} hint={hint} error={error} />
    </div>
  );
}

type SelectFieldProps = FieldChrome & Omit<ComponentPropsWithRef<"select">, "className"> & { children: ReactNode };

export function SelectField({ label, hint, error, dark, className = "", id, children, ...rest }: SelectFieldProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <select
        id={fieldId}
        className={`pirate-input ${dark ? "dark" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId, hint, error)}
        {...rest}
      >
        {children}
      </select>
      <Messages hintId={hintId} errorId={errorId} hint={hint} error={error} />
    </div>
  );
}

type TextAreaFieldProps = FieldChrome & Omit<ComponentPropsWithRef<"textarea">, "className">;

export function TextAreaField({ label, hint, error, dark, className = "", id, ...rest }: TextAreaFieldProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <textarea
        id={fieldId}
        className={`pirate-input ${dark ? "dark" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId, hint, error)}
        rows={4}
        {...rest}
      />
      <Messages hintId={hintId} errorId={errorId} hint={hint} error={error} />
    </div>
  );
}

type CheckFieldProps = Omit<FieldChrome, "dark"> & Omit<ComponentPropsWithRef<"input">, "className" | "type">;

export function CheckField({ label, hint, error, className = "", id, ...rest }: CheckFieldProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  return (
    <div className={className}>
      <div className="check-row">
        <input
          id={fieldId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(hintId, errorId, hint, error)}
          {...rest}
        />
        <label htmlFor={fieldId} className="font-fell">
          {label}
        </label>
      </div>
      <Messages hintId={hintId} errorId={errorId} hint={hint} error={error} />
    </div>
  );
}

/** A friendly error summary that links to each broken field. */
export function ErrorSummary({ errors, title = "Arrr. The form has sprung some leaks:" }: { errors: { id: string; message: string }[]; title?: string }) {
  if (errors.length === 0) return null;
  return (
    <div className="error-summary" role="alert">
      <p className="font-pirate text-xl">{title}</p>
      <ul className="list-disc pl-5">
        {errors.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`} onClick={(ev) => {
              ev.preventDefault();
              document.getElementById(e.id)?.focus();
            }}>
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
