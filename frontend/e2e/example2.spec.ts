import { expect, test } from "@playwright/test";

const USERNAME = "TestUnbound";
const PASSWORD = "kUxQ9eizX3GHTf";

test("basic test", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ storageState: "./auth.json" });
  const page = await context.newPage();
  // console.log(context);

  await page.goto("/");
  // await page.click("text=Log In");
  await page.waitForTimeout(6000);

  await page.waitForLoadState("networkidle");
  // await page.fill('input[name="username"]', USERNAME);
  // await page.fill('input[name="password"]', PASSWORD);
  // await page.click("text=Sign in");
  // await page.waitForTimeout(1000);
  // await page.click("text=Authorise");
  // await page.waitForTimeout(1000);
  // await page.waitForLoadState("networkidle");
  // await page.goto("/");
  // await page.waitForLoadState("networkidle");
  // await page.click("text=Forms List");
  // await page.waitForLoadState("networkidle");

  // await page.screenshot({ path: "screenshot.png" });

  await page.screenshot({ path: `./e2e_screenshots/${testInfo.title}.png` });

  // const title = page.locator("font-museo lg:text-4xl mt-4 text-center");
  // await expect(title).toHaveText("an innovative solution for your osu! projects.");
});
