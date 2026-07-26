import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (image?: string) => {
  if (!image) {
    return "/placeholder.png";
  }

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`;
  }

  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image}`;
};