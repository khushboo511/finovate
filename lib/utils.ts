/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date | string) => {
  const date = new Date(dateString);

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return {
    dateTime: date.toLocaleString("en-US", dateTimeOptions),
    dateDay: date.toLocaleString("en-US", dateDayOptions),
    dateOnly: date.toLocaleString("en-US", dateOptions),
    timeOnly: date.toLocaleString("en-US", timeOptions),
  };
};

// Format currency amount
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Parse and stringify JSON data safely
export const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

// Remove special characters from a string
export const removeSpecialCharacters = (value: string) =>
  value.replace(/[^\w\s]/gi, "");

// URL Query Manipulation
interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

// Get Account Type Colors
export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };
    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };
    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

// Count Transaction Categories
export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  transactions?.forEach((transaction) => {
    const category = transaction.category;
    if (Object.prototype.hasOwnProperty.call(categoryCounts, category)) {
      categoryCounts[category]++;
    } else {
      categoryCounts[category] = 1;
    }
    totalCount++;
  });

  return Object.keys(categoryCounts)
    .map((category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    }))
    .sort((a, b) => b.count - a.count);
}

// Extract Customer ID from URL
export function extractCustomerIdFromUrl(url: string) {
  const parts = url.replace(/\/$/, "").split("/");
  return parts.pop() || "";
}

// Encrypt & Decrypt ID
export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

// Get Transaction Status
export const getTransactionStatus = (date: Date | string) => {
  const transactionDate = new Date(date);
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return transactionDate > twoDaysAgo ? "Processing" : "Success";
};

// Auth Form Schema Validation
const optionalIfSignIn = (type: string, schema: z.ZodTypeAny) => {
  return type === "sign-in" ? schema.optional() : schema;
};

export const authFormSchema = (type: string) =>
  z.object({
    firstName: optionalIfSignIn(type, z.string().min(3)),
    lastName: optionalIfSignIn(type, z.string().min(3)),
    address1: optionalIfSignIn(type, z.string().max(50)),
    city: optionalIfSignIn(type, z.string().max(50)),
    state: optionalIfSignIn(type, z.string().length(2)),
    postalCode: optionalIfSignIn(type, z.string().min(3).max(6)),
    dateOfBirth: optionalIfSignIn(type, z.string().min(3)),
    ssn: optionalIfSignIn(type, z.string().min(3)),
    email: z.string().email(),
    password: z.string().min(8),
  });
