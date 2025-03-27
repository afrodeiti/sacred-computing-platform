import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

export function calculateHarmonicFrequency(frequency: number): number {
  return Math.round((frequency * (1 + Math.sqrt(5)) / 2) * 100) / 100;
}

export function findClosestSolfeggio(frequency: number): number {
  const solfeggio = [396, 417, 528, 639, 741, 852, 963];
  let closest = solfeggio[0];
  let closestDiff = Math.abs(frequency - closest);
  
  for (let i = 1; i < solfeggio.length; i++) {
    const diff = Math.abs(frequency - solfeggio[i]);
    if (diff < closestDiff) {
      closest = solfeggio[i];
      closestDiff = diff;
    }
  }
  
  return closest;
}

export function generateRandomHexColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}
