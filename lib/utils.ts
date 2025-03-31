// @ts-nocheck
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging Tailwind classes with clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility functions for the application
 */

// Format date for display
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Convert a file to data URL for preview
export function fileToDataUrl(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Delay function for simulating loading states in development
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Free tier generation limit
export const FREE_GENERATION_LIMIT = 5;

// Check if the user has free generations remaining
export function hasFreeTier(generationCount: number): boolean {
  return generationCount < FREE_GENERATION_LIMIT;
}

// Calculate remaining free generations
export function remainingFreeGenerations(currentCount: number): number {
  return Math.max(0, FREE_GENERATION_LIMIT - currentCount);
}

// Convert base64 to blob for file downloads
export function base64ToBlob(base64: string, mimeType: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Handle the case where the base64 string might already be split or not include the data:image prefix
      let byteString;
      
      // If it's a complete data URL (e.g., "data:image/png;base64,abc123")
      if (base64.includes(',')) {
        byteString = atob(base64.split(',')[1]);
      } 
      // If it's just the base64 part without the data URL prefix
      else {
        // Remove any whitespace or line breaks that might be in the base64 string
        const cleanedBase64 = base64.replace(/\s/g, '');
        byteString = atob(cleanedBase64);
      }
      
      // Create array buffer from binary string
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      resolve(new Blob([ab], { type: mimeType }));
    } catch (e) {
      console.error('Error in base64ToBlob conversion:', e);
      
      try {
        // As a fallback, try to clean the string before decoding
        const cleaned = base64.replace(/\s/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
        const byteString = atob(cleaned);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        resolve(new Blob([ab], { type: mimeType }));
      } catch (fallbackError) {
        console.error('Secondary base64 decode error:', fallbackError);
        reject(new Error(`Failed to convert base64 to blob: ${e.message}`));
      }
    }
  });
}

// Download a URL as a file
export function downloadImage(url: string, filename: string = 'image.png'): void {
  // For data URLs, we can use the anchor download directly
  if (url.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // For regular URLs, fetch the image first to force download
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    })
    .catch(error => {
      console.error('Error downloading image:', error);
    });
}

// Debounce function for preventing excessive API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
