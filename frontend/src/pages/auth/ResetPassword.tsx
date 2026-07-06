import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { AuthLayout, AuthCard, PasswordInput } from '@/components/auth';
import authService from '@/services/auth/authService';
import { validatePassword as validateSharedPassword } from '@/utils/authValidation';

const validatePassword = (value: string) => {
  if (!value) return 'Please enter your new password.';
  return validateSharedPassword(value);
};

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const passwordError = useMemo(() => validatePassword(password), [password]);
  const confirmError = submitted && !confirmPassword
    ? 'Please confirm your new password.'
    : submitted && password !== confirmPassword
      ? 'Passwords do not match. Please try again.'
      : '';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitted(true);
    setServerError('');
    if (passwordError || password !== confirmPassword) return;

    setSubmitting(true);
    try {
      await authService.resetPassword(token || '', { password, confirmPassword });
      setSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'This password reset link has expired. Please request a new one.';
      setServerError(message.includes('invalid') || message.includes('expired') || message.includes('used')
        ? 'This password reset link has expired. Please request a new one.'
        : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        {success ? (
          <div className="text-center space-y-5">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-50 dark:bg-[#1E293B] text-green-600 dark:text-[#34D399] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[26px] font-bold text-neutral-900 dark:text-[#F8FAFC] tracking-tight">Password updated</h2>
              <p className="mt-2 text-[14px] text-neutral-500 dark:text-[#CBD5E1]">
                Your account is secure. You can now sign in with your new password.
              </p>
            </div>
            <Link to="/login" className="inline-flex text-[13px] font-semibold text-blue-600 dark:text-[#93C5FD]">
              Continue to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-left">
              <h2 className="text-[26px] font-bold text-neutral-900 dark:text-[#F8FAFC] tracking-tight leading-tight">
                Create new password
              </h2>
              <p className="mt-1.5 text-[14px] text-neutral-500 dark:text-[#CBD5E1]">
                Choose a strong password to restore access to your workspace.
              </p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <PasswordInput
                id="reset-password"
                label="New Password"
                value={password}
                onChange={setPassword}
                error={submitted ? passwordError : ''}
                autoComplete="new-password"
                placeholder="Create a strong password"
                showStrength
              />
              <PasswordInput
                id="reset-confirm"
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={confirmError}
                autoComplete="new-password"
                placeholder="Repeat your password"
              />
              {serverError && <p className="text-[12px] font-medium text-red-600 dark:text-red-400">{serverError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Update password
              </button>
            </form>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
};

export default ResetPassword;
