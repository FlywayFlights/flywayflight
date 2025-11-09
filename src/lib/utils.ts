import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const generateBookingDetails = () => {
  const pnr = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8-digit numeric PNR
  const randomLetters = Math.random()
    .toString(36)
    .substring(2, 4)
    .toUpperCase();
  const randomAlphaNum = Math.random()
    .toString(36)
    .substring(2, 18)
    .toUpperCase();
  const bookingNo = `NN${randomLetters}${randomAlphaNum}`;
  return { pnr, bookingNo };
};
