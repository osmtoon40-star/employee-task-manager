import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';

interface CodeResponse {
  access_token: string;
  token_type?: string;
  scope?: string;
  expires_in?: number;
}

interface GoogleAuthButtonProps {
  onSuccess: (accessToken: string) => Promise<void>;
  onError?: (error: string) => void;
  disabled?: boolean;
  hidden?: boolean;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Inner component that uses the useGoogleLogin hook.
 * Only rendered when GoogleOAuthProvider is present in the tree.
 */
const GoogleAuthButtonInner: React.FC<GoogleAuthButtonProps> = ({ onSuccess, onError, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (codeResponse: CodeResponse) => {
      try {
        setIsLoading(true);
        if (codeResponse.access_token) {
          await onSuccess(codeResponse.access_token);
        } else {
          throw new Error('No access token received from Google');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Google authentication failed';
        onError?.(message);
        setIsLoading(false);
      }
    },
    onError: () => {
      const message = 'Google authentication failed. Please try again.';
      onError?.(message);
    },
    flow: 'implicit'
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={disabled || isLoading}
      aria-label="Continue with Google"
      className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-[15px] font-medium text-neutral-900 dark:text-[#F8FAFC] bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:border-neutral-400 dark:hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:border-neutral-300 dark:disabled:hover:border-neutral-700"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          {/* Google Logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_3819_119)">
              <path
                d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.28h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.59z"
                fill="#4285F4"
              />
              <path
                d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.13-4.07 1.13-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"
                fill="#34A853"
              />
              <path
                d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V7.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
                fill="#FBBC05"
              />
              <path
                d="M12.255 5.26c1.77 0 3.36.61 4.6 1.8l3.44-3.44C18.205 1.92 15.495.75 12.255.75c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.95 6.73-4.95z"
                fill="#EA4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_3819_119">
                <path fill="#fff" d="M0 0h24v24H0z" />
              </clipPath>
            </defs>
          </svg>
          <span>Continue with Google</span>
        </>
      )}
    </button>
  );
};

/**
 * Professional Google Sign-In button following Google's branding guidelines
 * Displays as "Continue with Google" with Google logo
 * Uses Google's access token which will be verified on the backend
 *
 * Returns null if VITE_GOOGLE_CLIENT_ID is not configured, avoiding the
 * requirement for GoogleOAuthProvider to be in the tree.
 */
export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = (props) => {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  if (props.hidden || !GOOGLE_CLIENT_ID) return null;
  return <GoogleAuthButtonInner {...props} />;
};

/**
 * Divider component for separating authentication options
 */
export const AuthDivider: React.FC = () => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
    <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">OR</span>
    <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
  </div>
);

export default GoogleAuthButton;
