import { describe, it, expect } from "vitest";
import {
  calculateLineTotal,
  calculateTax,
  addDecimals,
  subtractDecimals,
  toDecimal,
  paginate,
  generateOrderNumber,
  MAX_PAGE_SIZE,
} from "./index";

function toNum(d: unknown): number {
  return Number(d);
}

describe("decimal arithmetic", () => {
  it("adds decimals without floating point errors", () => {
    expect(toNum(addDecimals(10.5, 20.3))).toBe(30.8);
  });

  it("subtracts decimals precisely", () => {
    expect(toNum(subtractDecimals(100, 33.3))).toBe(66.7);
  });

  it("multiplies decimals precisely", () => {
    expect(toNum(toDecimal(99.99).times(3))).toBe(299.97);
  });
});

describe("tax calculation", () => {
  it("calculates 10% tax", () => {
    const tax = calculateTax(100, 10);
    expect(tax.toNumber()).toBe(10);
  });

  it("calculates tax on a line total", () => {
    const res = calculateLineTotal(99.99, 3, 7.5);
    expect(res.subtotal.toNumber()).toBe(299.97);
    expect(res.taxAmount.toNumber()).toBe(22.5);
    expect(res.lineTotal.toNumber()).toBe(322.47);
  });
});

describe("pagination", () => {
  it("caps at MAX_PAGE_SIZE", () => {
    expect(paginate(1, 200, 500).take).toBe(MAX_PAGE_SIZE);
  });

  it("computes total pages", () => {
    const p = paginate(1, 20, 45);
    expect(p.totalPages).toBe(3);
    expect(p.page).toBe(1);
    expect(p.skip).toBe(0);
  });

  it("clamps page beyond total", () => {
    const p = paginate(99, 10, 45);
    expect(p.page).toBe(5);
  });
});

describe("order number", () => {
  it("generates an ORD-prefixed number", () => {
    expect(generateOrderNumber()).toMatch(/^ORD-\d{10}-[A-Z0-9]{4}$/);
  });
});
