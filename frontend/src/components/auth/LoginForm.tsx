import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { GoogleAuthButton, AuthDivider } from './GoogleAuthButton';
import { cn } from '@/utils';
import { normalizeEmail, validateEmail } from '@/utils/authValidation';
import useAuth from '@/hooks/useAuth';

const validatePassword = (v: string) => {
  if (!v) return 'Please enter your password.';
  return '';
};

/* ── Field ── */
const Field: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  onBlur?: () => void;
}> = ({ id, label, type = 'text', value, onChange, error, autoComplete, placeholder, onBlur }) => (
  <div className="w-full space-y-1 text-left">
    <label htmlFor={id} className="block text-[14px] font-semibold text-neutral-800 dark:text-[#F8FAFC]">
      {label}
    </label>
    <input
      id={id}
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
);

/* ── Divider ── */
const Divider = () => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-neutral-200 dark:bg-[#334155]" />
    <span className="text-[12px] text-neutral-400 font-medium">OR</span>
    <div className="flex-1 h-px bg-neutral-200 dark:bg-[#334155]" />
  </div>
);

/* ── LoginForm ── */
export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const touch = (field: 'email' | 'password') =>
    setTouched(t => ({ ...t, [field]: true }));

  const navigate = useNavigate();
  const { login, googleAuth } = useAuth();

  const validate = () => {
    const e: typeof errors = {};
    const em = validateEmail(normalizeEmail(email));
    const pw = validatePassword(password);
    if (em) e.email = em;
    if (pw) e.password = pw;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setTouched({ email: true, password: true });
    if (!validate()) return;
    const normalizedEmail = normalizeEmail(email);
    setEmail(normalizedEmail);
    setSubmitting(true);
    try {
      await login({ email: normalizedEmail, password });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors({ password: error instanceof Error ? error.message : 'The email address or password you entered is incorrect.' });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field
        id="login-email"
        label="Email address"
        type="email"
        value={email}
        onChange={v => { setEmail(v); if (touched.email) setErrors(er => ({ ...er, email: validateEmail(v) })); }}
        onBlur={() => {
          touch('email');
          const normalizedEmail = normalizeEmail(email);
          setEmail(normalizedEmail);
          setErrors(er => ({ ...er, email: validateEmail(normalizedEmail) }));
        }}
        error={touched.email ? errors.email : ''}
        autoComplete="email"
        placeholder="you@company.com"
      />

      <div onBlur={() => touch('password')}>
        <PasswordInput
          id="login-password"
          label="Password"
          value={password}
          onChange={v => { setPassword(v); if (touched.password) setErrors(er => ({ ...er, password: validatePassword(v) })); }}
          error={touched.password ? errors.password : ''}
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </div>

      {/* Remember me + Forgot */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            id="login-remember"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500/30 accent-blue-600 cursor-pointer"
          />
          <span className="text-[13px] text-neutral-600 dark:text-[#CBD5E1] font-medium">
            Remember me
          </span>
        </label>
        <Link
          to="/forgot-password"
          className="text-[13px] font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Primary CTA */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <AuthDivider />

      {/* Google Auth */}
      <GoogleAuthButton
        onSuccess={async (idToken) => {
          setSubmitting(true);
          try {
            await googleAuth(idToken);
            navigate('/dashboard', { replace: true });
          } catch (error) {
            setErrors({ password: error instanceof Error ? error.message : 'Google authentication failed. Please try again.' });
            setSubmitting(false);
          }
        }}
        onError={(error) => {
          setErrors({ password: error });
          setSubmitting(false);
        }}
        disabled={submitting}
      />

      <Divider />

      {/* Register link */}
      <p className="text-center text-[13px] text-neutral-600 dark:text-[#CBD5E1]">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors"
        >
          Create Account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
