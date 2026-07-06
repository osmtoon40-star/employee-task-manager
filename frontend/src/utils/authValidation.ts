const INVISIBLE_OR_CONTROL_RE = /[\p{C}\u200B-\u200D\uFEFF]/u;
const NAME_ALLOWED_RE = /^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u;
const EMAIL_CONTROL_RE = /[\s\p{C}]/u;

export const normalizeName = (value: string) =>
  value.normalize('NFC').replace(/\s+/g, ' ').trim();

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const validateName = (value: string) => {
  const normalized = normalizeName(value);
  if (!normalized) return 'Please enter your full name.';
  if (INVISIBLE_OR_CONTROL_RE.test(normalized)) return 'Full name can only contain letters and spaces.';
  if (!NAME_ALLOWED_RE.test(normalized)) {
    return 'Full name can only contain letters and spaces.';
  }
  if (normalized.length < 2) return 'Full name must contain at least 2 characters.';
  if (normalized.length > 50) return 'Full name cannot exceed 50 characters.';
  return '';
};

export const validateEmail = (value: string) => {
  const email = normalizeEmail(value);
  if (!email) return 'Please enter your email address.';
  if (email.length > 254) return 'Please enter a valid email address.';
  if (EMAIL_CONTROL_RE.test(email)) return 'Please enter a valid email address.';

  const parts = email.split('@');
  if (parts.length !== 2) return 'Please enter a valid email address.';

  const [local, domain] = parts;
  if (!local) return 'Please enter a valid email address.';
  if (!domain) return 'Please enter a valid email address.';
  if (local.length > 64) return 'Please enter a valid email address.';
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
    return 'Please enter a valid email address.';
  }
  if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/i.test(local)) {
    return 'Please enter a valid email address.';
  }
  if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) {
    return 'Please enter a valid email address.';
  }

  const labels = domain.split('.');
  if (labels.length < 2) return 'Please enter a valid email address.';
  if (labels.some(label => !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) {
    return 'Please enter a valid email address.';
  }
  if (!/^[a-z]{2,63}$/.test(labels[labels.length - 1])) return 'Please enter a valid email address.';
  return '';
};

export const validatePassword = (value: string) => {
  if (!value) return 'Please enter your password.';
  if (value.trim() !== value) return 'Please choose a stronger password that meets all security requirements.';
  if (!value.trim()) return 'Please enter your password.';
  if (INVISIBLE_OR_CONTROL_RE.test(value)) return 'Please choose a stronger password that meets all security requirements.';
  if (value.length < 8) return 'Password must be at least 8 characters long.';
  if (value.length > 32) return 'Password cannot exceed 32 characters.';
  if (!/\p{Lu}/u.test(value)) return 'Password must include at least one uppercase letter.';
  if (!/\p{Ll}/u.test(value)) return 'Password must include at least one lowercase letter.';
  if (!/\p{N}/u.test(value)) return 'Password must include at least one number.';
  if (!/[^\p{L}\p{N}]/u.test(value)) return 'Password must include at least one special character.';
  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword) return 'Please confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match. Please try again.';
  return '';
};
