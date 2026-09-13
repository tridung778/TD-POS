import { Decimal } from "@prisma/client/runtime/library";

export type { Decimal };

function isDecimal(value: unknown): value is Decimal {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { toNumber?: unknown }).toNumber === "function" &&
    typeof (value as { times?: unknown }).times === "function"
  );
}

export function toNumber(value: Decimal | string | number): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return value.toNumber();
}

export function toDecimal(value: number | string | Decimal): Decimal {
  if (isDecimal(value)) return value;
  return new Decimal(value);
}

export function addDecimals(a: Decimal | string | number, b: Decimal | string | number): Decimal {
  return toDecimal(a).plus(toDecimal(b));
}

export function subtractDecimals(a: Decimal | string | number, b: Decimal | string | number): Decimal {
  return toDecimal(a).minus(toDecimal(b));
}

export function multiplyDecimals(a: Decimal | string | number, b: Decimal | string | number): Decimal {
  return toDecimal(a).times(toDecimal(b));
}

export function divideDecimals(a: Decimal | string | number, b: Decimal | string | number): Decimal {
  return toDecimal(a).dividedBy(toDecimal(b));
}

export function roundDecimal(value: Decimal | string | number, decimals = 2): Decimal {
  return toDecimal(value).toDecimalPlaces(decimals);
}

export function calculateTax(amount: Decimal | string | number, taxRate: Decimal | string | number): Decimal {
  const rate = divideDecimals(taxRate, 100);
  return multiplyDecimals(amount, rate);
}

export interface LineTotalResult {
  subtotal: Decimal;
  taxAmount: Decimal;
  lineTotal: Decimal;
}

export function calculateLineTotal(
  price: Decimal | string | number,
  quantity: number,
  taxRate: Decimal | string | number
): LineTotalResult {
  const subtotal = multiplyDecimals(price, quantity);
  const taxAmount = calculateTax(subtotal, taxRate);
  const lineTotal = addDecimals(subtotal, taxAmount);
  return {
    subtotal: roundDecimal(subtotal),
    taxAmount: roundDecimal(taxAmount),
    lineTotal: roundDecimal(lineTotal),
  };
}

export function generateOrderNumber(prefix = "ORD"): string {
  const ts = Date.now().toString().slice(-10);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export function generateSku(parts: string[]): string {
  if (parts.length === 0) return "";
  return parts.join("-").toUpperCase();
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;

export function paginate(page: number, limit: number, total: number): PaginationResult {
  const size = Math.min(Math.max(limit, 1), MAX_PAGE_SIZE);
  const totalPages = Math.max(Math.ceil(total / size), 1);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (currentPage - 1) * size;
  return { skip, take: size, page: currentPage, limit: size, total, totalPages };
}
