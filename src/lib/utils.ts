import { clsx, type ClassValue } from "clsx"
import { json } from "stream/consumers"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: string) =>{
  console.log("Value to Stringify: " + value);
  const newVal = JSON.parse(JSON.stringify(value));
  console.log("Stringified Value: " + newVal);
  return newVal;
}
  // JSON.parse(JSON.stringify(value));