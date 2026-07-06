import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MailCheck } from 'lucide-react';
import { AuthLayout, AuthCard } from '@/components/auth';
import { cn } from '@/utils';
import authService from '@/services/auth/authService';
import { normalizeEmail, validateEmail } from '@/utils/authValidation';

const validateForgotEmail = (value: string) => {
  if (!normalizeEmail(value)) return 'Please enter your registered email address.';
  return validateEmail(value);
};

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setTouched(true);
    const normalizedEmail = normalizeEmail(email);
    const validation = validateForgotEmail(normalizedEmail);
    setError(validation);
    if (validation) return;

    setEmail(normalizedEmail);
    setSubmitting(true);
    try {
      await authService.forgotPassword({ email: normalizedEmail });
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Password reset request could not be completed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        {sent ? (
          <div className="text-center space-y-5">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 dark:bg-[#1E293B] text-blue-600 dark:text-[#93C5FD] flex items-center justify-center">
              <MailCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[26px] font-bold text-neutral-900 dark:text-[#F8FAFC] tracking-tight">Check your email</h2>
              <p className="mt-2 text-[14px] text-neutral-500 dark:text-[#CBD5E1]">
                If an account exists, a secure reset link has been sent.
              </p>
            </div>
            <Link to="/login" className="inline-flex text-[13px] font-semibold text-blue-600 dark:text-[#93C5FD]">
              Return to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-left">
              <h2 className="text-[26px] font-bold text-neutral-900 dark:text-[#F8FAFC] tracking-tight leading-tight">
                Reset your password
              </h2>
              <p className="mt-1.5 text-[14px] text-neutral-500 dark:text-[#CBD5E1]">
                Enter your work email and we will send a secure recovery link.
              </p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-5 text-left">
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="block text-[14px] font-semibold text-neutral-800 dark:text-[#F8FAFC]">
                  Work Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (touched) setError(validateForgotEmail(event.target.value));
                  }}
                  onBlur={() => {
                    setTouched(true);
                    const normalizedEmail = normalizeEmail(email);
                    setEmail(normalizedEmail);
                    setError(validateForgotEmail(normalizedEmail));
                  }}
                  placeholder="you@company.com"
                  aria-invalid={!!error && touched}
                  aria-describedby={error && touched ? 'forgot-email-error' : undefined}
                  className={cn(
                    'w-full px-3.5 py-2.5 text-[15px] bg-white dark:bg-[#111827] border rounded-lg shadow-sm transition-all duration-200',
                    'placeholder-neutral-400 dark:placeholder-[#94A3B8] text-neutral-900 dark:text-[#F8FAFC]',
                    'focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-[#60A5FA]',
                    error && touched ? 'border-red-400 dark:border-red-600 focus:ring-red-500/20' : 'border-neutral-300 dark:border-[#334155] focus:ring-blue-500/20'
                  )}
                />
                {error && touched && <p id="forgot-email-error" role="alert" className="text-[12px] font-medium text-red-600 dark:text-red-400">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Send reset link
              </button>
              <p className="text-center text-[13px] text-neutral-500 dark:text-[#94A3B8]">
                Remembered it? <Link to="/login" className="font-semibold text-blue-700 dark:text-[#93C5FD]">Sign In</Link>
              </p>
            </form>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPassword;
