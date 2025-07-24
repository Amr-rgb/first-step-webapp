// -----------------------------
// Chat Feature Utilities
// -----------------------------
import { User } from '../types';

/**
 * Get the first two characters of a user's name (for parent avatar)
 */
export function getUserInitials(user: User): string {
  if (!user.name) return '';
  return user.name.slice(0, 2).toUpperCase();
}

/**
 * Get the logo URL for a user (center/admin), or fallback for parent
 */
export function getUserLogo(user: User): string | undefined {
  if (user.role === 'center' || user.role === 'admin') {
    return user.logoUrl;
  }
  // Optionally, return a default avatar for parent if needed
  return undefined;
}

// -----------------------------
// (Add other chat utilities below as needed)
// ----------------------------- 