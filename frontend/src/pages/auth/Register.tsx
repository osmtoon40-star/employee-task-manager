import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <AuthLayout>
      <AuthCard className="!py-5">
        {/* Card heading */}
        <div className="mb-4 text-left">
          <h2 className="text-[26px] font-bold text-neutral-900 dark:text-[#F8FAFC] tracking-tight leading-tight">
            Create your account
          </h2>
          <p className="mt-1.5 text-[14px] text-neutral-500 dark:text-[#CBD5E1]">
            Join Employee Task Manager — takes less than a minute
          </p>
        </div>

        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default Register;
