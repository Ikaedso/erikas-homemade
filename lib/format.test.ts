import { describe, expect, it } from "vitest";
import { formatCOP, formatHora } from "./format";

describe("formatCOP", () => {
  it("formatea en pesos con punto de miles y sin decimales", () => {
    expect(formatCOP(72000)).toBe("$72.000");
    expect(formatCOP(0)).toBe("$0");
    expect(formatCOP(1234567)).toBe("$1.234.567");
  });

  it("redondea valores no enteros", () => {
    expect(formatCOP(72000.4)).toBe("$72.000");
  });
});

describe("formatHora", () => {
  it("usa la zona America/Bogota (-05:00), formato 24h", () => {
    // 16:15 UTC → 11:15 en Bogotá
    expect(formatHora("2026-09-15T16:15:00Z")).toBe("11:15");
  });
});
