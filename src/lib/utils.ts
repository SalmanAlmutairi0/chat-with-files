import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatedDate = (date: string) => {
  const d = new Date(date)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}