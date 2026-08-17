import { test, expect } from "@playwright/test";

test("la home carga y lleva al catálogo", async ({ page }) => {
  await page.goto("/");

  // Hero de marca
  await expect(page.getByRole("heading", { name: /Cosido a mano/i })).toBeVisible();

  // Navegación por categorías
  await expect(page.getByRole("link", { name: "Ver el catálogo" })).toBeVisible();

  // La marca aparece en el header
  await expect(page.getByRole("link", { name: /Erika's Homemade/i }).first()).toBeVisible();
});

test("navegar a una categoría muestra el título", async ({ page }) => {
  await page.goto("/mujer");
  await expect(page.getByRole("heading", { name: "Mujer" })).toBeVisible();
});
