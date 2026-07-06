import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';
import useAuth from '@/hooks/useAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initialized } = useAuth();

  useEffect(() => {
    if (initialized && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [initialized, isAuthenticated, navigate]);

  return (
    <AuthLayout>
      <AuthCard className="!py-6">
        {/* Card heading */}
        <div className="mb-5 text-left">
          <h2 className="text-[26px] font-bold text-neutral-900 dark:text-[#F8FAFC] tracking-tight leading-tight">
            Welcome back
          </h2>
          <p className="mt-1.5 text-[14px] text-neutral-500 dark:text-[#CBD5E1]">
            Sign in to your Employee Task Manager account
          </p>
        </div>

        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
