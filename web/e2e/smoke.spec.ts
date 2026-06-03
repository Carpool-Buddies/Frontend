import { test, expect } from "@playwright/test";

// These run against the dev server (no backend auth needed) and verify routing,
// the public landing page, and middleware protection.

test("landing page shows brand and CTA, links to login", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("CarpoolBuddies").first()).toBeVisible();
  // Header "כניסה" (login) link navigates to /login
  await page.getByRole("link", { name: "כניסה" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("login page shows Google and Microsoft options", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("המשך עם Google")).toBeVisible();
  await expect(page.getByText("המשך עם Microsoft")).toBeVisible();
  await expect(page.getByText("ברוכים הבאים")).toBeVisible();
});

test("protected /dashboard redirects to /login when unauthenticated", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});

test("protected /rides redirects to /login when unauthenticated", async ({ page }) => {
  await page.goto("/rides");
  await expect(page).toHaveURL(/\/login$/);
});
