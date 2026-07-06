const INVISIBLE_OR_CONTROL_RE = /[\p{C}\u200B-\u200D\uFEFF]/u;
const NAME_ALLOWED_RE = /^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u;
const EMAIL_CONTROL_RE = /[\s\p{C}]/u;

const normalizeName = (value) =>
  typeof value === 'string'
    ? value.normalize('NFC').replace(/\s+/g, ' ').trim()
    : value;

const normalizeEmail = (value) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

const isPlainString = (value) => typeof value === 'string';

const isValidName = (value) => {
  if (!isPlainString(value)) return false;
  const normalized = normalizeName(value);
  if (!normalized || normalized.length < 3 || normalized.length > 50) return false;
  if (INVISIBLE_OR_CONTROL_RE.test(normalized)) return false;
  if (!NAME_ALLOWED_RE.test(normalized)) return false;
  return /\p{L}/u.test(normalized);
};

const isValidEmail = (value) => {
  if (!isPlainString(value)) return false;
  const email = normalizeEmail(value);
  if (!email || email.length > 254 || EMAIL_CONTROL_RE.test(email)) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || !domain || local.length > 64 || domain.length > 253) return false;
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) return false;

  const labels = domain.split('.');
  if (labels.length < 2) return false;
  if (labels.some((label) => !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) {
    return false;
  }
  if (!/^[a-z]{2,63}$/.test(labels[labels.length - 1])) return false;

  return /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/i.test(local);
};

const getPasswordError = (value) => {
  if (!isPlainString(value) || !value) return 'Please enter your password.';
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

module.exports = {
  getPasswordError,
  isPlainString,
  isValidEmail,
  isValidName,
  normalizeEmail,
  normalizeName
};
