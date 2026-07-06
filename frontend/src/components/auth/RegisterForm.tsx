import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { AvatarUploader } from './AvatarUploader';
import { GoogleAuthButton, AuthDivider } from './GoogleAuthButton';
import { Button, Modal } from '@/components/ui';
import { cn } from '@/utils';
import { normalizeEmail, normalizeName, validateConfirmPassword, validateEmail, validateName, validatePassword } from '@/utils/authValidation';
import useAuth from '@/hooks/useAuth';

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  onBlur?: () => void;
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, type = 'text', value, onChange, error, autoComplete, placeholder, onBlur }, ref) => (
    <div className="w-full space-y-1 text-left">
      <label htmlFor={id} className="block text-[14px] font-semibold text-neutral-800 dark:text-[#F8FAFC]">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'w-full px-3.5 py-2.5 text-[15px] bg-white dark:bg-neutral-900 border rounded-lg shadow-sm transition-all duration-200',
          'placeholder-neutral-400 dark:placeholder-[#94A3B8] text-neutral-900 dark:text-[#F8FAFC]',
          'focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500',
          'hover:border-neutral-400 dark:hover:border-neutral-600',
          error
            ? 'border-red-400 dark:border-red-600 focus:ring-red-500/20'
            : 'border-neutral-300 dark:border-[#334155] focus:ring-blue-500/20'
        )}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[12px] font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
);

type Fields = 'name' | 'email' | 'password' | 'confirm';

/* ── RegisterForm ── */
export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<Fields, boolean>>>({});
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Fields, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmRef = React.useRef<HTMLInputElement>(null);

  const clientErrors = {
    name: touched.name ? validateName(name) : '',
    email: touched.email ? validateEmail(email) : '',
    password: touched.password ? validatePassword(password) : '',
    confirm: touched.confirm ? validateConfirmPassword(password, confirm) : '',
  };

  const errors = {
    name: clientErrors.name || fieldErrors.name,
    email: clientErrors.email || fieldErrors.email,
    password: clientErrors.password || fieldErrors.password,
    confirm: clientErrors.confirm || fieldErrors.confirm,
  };

  const navigate = useNavigate();
  const { register, googleAuth } = useAuth();

  const focusFirstInvalidField = (nextErrors = errors) => {
    if (nextErrors.name) return nameRef.current?.focus();
    if (nextErrors.email) return emailRef.current?.focus();
    if (nextErrors.password) return passwordRef.current?.focus();
    if (nextErrors.confirm) return confirmRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setTouched({ name: true, email: true, password: true, confirm: true });
    setFieldErrors({});
    setSubmitError('');

    const normalizedName = normalizeName(name);
    const normalizedEmail = normalizeEmail(email);
    const nameError = validateName(normalizedName);
    const emailError = validateEmail(normalizedEmail);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirm);

    if (nameError || emailError || passwordError || confirmError) {
      const nextErrors = { name: nameError, email: emailError, password: passwordError, confirm: confirmError };
      setFieldErrors(nextErrors);
      focusFirstInvalidField(nextErrors);
      return;
    }

    setName(normalizedName);
    setEmail(normalizedEmail);
    setSubmitting(true);
    try {
      await register({ name: normalizedName, email: normalizedEmail, password, confirmPassword: confirm, avatar });
      setSuccessOpen(true);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        const serverError = error as Error & { status: number; errors?: Array<{ field?: string; message: string }> };
        const serverFieldErrors = (serverError.errors || []).reduce<Partial<Record<Fields, string>>>((acc, item) => {
          if (item.field === 'name' || item.field === 'email' || item.field === 'password' || item.field === 'confirmPassword') {
            acc[item.field === 'confirmPassword' ? 'confirm' : item.field] = item.message;
          }
          return acc;
        }, {});
        if (serverError.status === 409) {
          setFieldErrors({ email: 'An account with this email already exists. Please sign in instead.' });
          emailRef.current?.focus();
        } else if (serverError.status === 429) {
          setSubmitError('Too many attempts. Please try again in a few minutes.');
        } else if (Object.keys(serverFieldErrors).length) {
          setFieldErrors(serverFieldErrors);
          focusFirstInvalidField(serverFieldErrors);
        } else if (serverError.status >= 500) {
          setSubmitError('Our server encountered an unexpected error. Please try again shortly.');
        } else {
          setSubmitError(serverError.message);
        }
      } else {
        setSubmitError('Unable to create account. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <AvatarUploader value={avatar} onChange={setAvatar} />

      <div>
        <Field
          id="reg-name"
          label="Full Name"
          value={name}
          onChange={value => {
            setName(value);
            setTouched(t => ({ ...t, name: true }));
            setFieldErrors(fe => ({ ...fe, name: validateName(value) }));
          }}
          onBlur={() => {
            setName(prev => normalizeName(prev));
          }}
          error={errors.name}
          autoComplete="name"
          placeholder="Your full name"
          ref={nameRef}
        />
      </div>

      <div>
        <Field
          id="reg-email"
          label="Work Email"
          type="email"
          value={email}
          onChange={value => { setEmail(value); if (touched.email) setFieldErrors(fe => ({ ...fe, email: validateEmail(value) })); }}
          onBlur={() => {
            setTouched(t => ({ ...t, email: true }));
            const normalizedEmail = normalizeEmail(email);
            setEmail(normalizedEmail);
            setFieldErrors(fe => ({ ...fe, email: validateEmail(normalizedEmail) }));
          }}
          error={errors.email}
          autoComplete="email"
          placeholder="you@company.com"
          ref={emailRef}
        />
      </div>

      <div>
        <PasswordInput
          id="reg-password"
          label="Password"
          value={password}
          onChange={value => { setPassword(value); if (touched.password) setFieldErrors(fe => ({ ...fe, password: validatePassword(value) })); }}
          onBlur={() => setTouched(t => ({ ...t, password: true }))}
          error={errors.password}
          autoComplete="new-password"
          placeholder="Create a strong password"
          showStrength
          inputRef={passwordRef}
        />
      </div>

      <div>
        <PasswordInput
          id="reg-confirm"
          label="Confirm Password"
          value={confirm}
          onChange={value => { setConfirm(value); if (touched.confirm) setFieldErrors(fe => ({ ...fe, confirm: validateConfirmPassword(password, value) })); }}
          onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
          error={errors.confirm}
          autoComplete="new-password"
          placeholder="Repeat your password"
          inputRef={confirmRef}
        />
      </div>

      {submitError && <p className="text-[12px] font-medium text-red-600 dark:text-red-400">{submitError}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 mt-1 py-2.5 px-4 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account…
          </>
        ) : (
          'Create Account'
        )}
      </button>

      <AuthDivider />

      {/* Google Auth */}
      <GoogleAuthButton
        onSuccess={async (idToken) => {
          setSubmitting(true);
          try {
            await googleAuth(idToken);
            setSuccessOpen(true);
          } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Google authentication failed. Please try again.');
            setSubmitting(false);
          }
        }}
        onError={(error) => {
          setSubmitError(error);
          setSubmitting(false);
        }}
        disabled={submitting}
      />

      {/* Login link */}
      <p className="text-center text-[13px] text-neutral-600 dark:text-[#CBD5E1]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </form>

    <Modal
      isOpen={successOpen}
      onClose={() => {
        setSuccessOpen(false);
        navigate('/login', { replace: true });
      }}
      title="Registration complete"
    >
      <div className="space-y-4 text-center px-2 py-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <p className="text-sm font-medium text-neutral-800 dark:text-[#F8FAFC]">
          Your account is ready. Move to login to access your dashboard.
        </p>
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => navigate('/login', { replace: true })}
        >
          Go to Login
        </Button>
      </div>
    </Modal>
  </>
  );
};

export default RegisterForm;
