import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    return {};
  }
}

export function getAvatarColor(id: string | number): "blue" | "pink" | "orange" | "green" | "purple" {
  const colors: ("blue" | "pink" | "orange" | "green" | "purple")[] = [
    'blue',
    'pink',
    'orange',
    'green',
    'purple',
  ];
  const strId = String(id);
  let hash = 0;
  for (let i = 0; i < strId.length; i++) {
    hash = strId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
}
