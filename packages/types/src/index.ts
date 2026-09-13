import type { Decimal } from "@prisma/client/runtime/library";

export type { Decimal };

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export type OrderStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "CARD" | "QR_CODE";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
export type InventoryType = "PURCHASE" | "SALE" | "RETURN" | "ADJUSTMENT" | "TRANSFER" | "VOID";
export type RoleName = "OWNER" | "ADMIN" | "MANAGER" | "CASHIER" | "INVENTORY_STAFF";
export type ShiftStatus = "OPEN" | "ACTIVE" | "CLOSED";

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;
