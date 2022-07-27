import { expect, Page, test } from "@playwright/test";

test.describe("CreateForm", async () => {
  let page: Page;

  test.use({ storageState: "auth.json" });

  const curDate = new Date().toJSON();
  // dont include ms
  const dateString = curDate.slice(0, curDate.length - 5);

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("localhost:3000");
    // await page.screenshot({ path: `./e2e_screenshots/TEST.png` });
    // await page.click("text=Log In");
    // await page.waitForLoadState("networkidle");
    // await page.goto("localhost:3000");
  });

  test("create a form -> edit -> publish -> answer", async () => {
    // await page.screenshot({ path: `./e2e_screenshots/TEST.png` });
    await page.locator('[data-testid="profileButton"]').click();

    await Promise.all([
      page.waitForNavigation(/*{ url: 'http://localhost:3000/dashboard' }*/),
      page.locator('[data-testid="manageForms"]').click()
    ]);

    // Click text=DASHBOARD
    await Promise.all([
      page.waitForNavigation(/*{ url: 'http://localhost:3000/create-new-form' }*/),
      await page.locator('[data-testid="createNewFormButton"]').click()
    ]);

    // Design tab
    await page.locator('[data-testid="title-input"]').click();
    await page.locator('[data-testid="title-input"]').fill(`tf-${dateString}`);

    await page.locator('[data-testid="description-input"]').click();
    await page.locator('[data-testid="description-input"]').fill("epicshortdescription");

    // test that title and description are listed 3 times on the page
    const previewTitles = await page.locator(`text=tf-${dateString}`).count();
    expect(previewTitles).toBe(2);
    const previewDescriptions = await page.locator(`text=epicshortdescription`);
    expect(await previewDescriptions.count()).toBe(2);

    // Post tab
    await page.locator('button[role="tab"]:has-text("Post")').click();
    await page.locator('textarea[name="postDescription"]').click();
    await page.locator('textarea[name="postDescription"]').fill("pd");

    // Questions tab
    await page.locator('button[role="tab"]:has-text("Questions")').click();

    // Create checkbox question
    await page.locator('[data-testid="questions-button-Checkbox"]').click();
    await page.locator('textarea[name="questions\\.0\\.title"]').click();
    await page.locator('textarea[name="questions\\.0\\.title"]').fill("myfirstcheckboxquestion");

    await page.locator('[data-testid="checkboxPlaceholder"]').click();
    await page.locator('input[name="questions\\.0\\.question_info\\.0\\.value"]').click();

    await page
      .locator('input[name="questions\\.0\\.question_info\\.0\\.value"]')
      .fill("my check 1");

    await page
      .locator(
        'text=PreviewmyfirstcheckboxquestionRemove optionRemove questionOptionalShow more >> input[type="text"]'
      )
      .first()
      .click();

    await page.locator('input[name="questions\\.0\\.question_info\\.1\\.value"]').fill("my check2");

    // Create text question
    await page.locator('[data-testid="questions-button-Freeform"]').click();
    await page.locator('textarea[name="questions\\.1\\.title"]').click();
    await page.locator('textarea[name="questions\\.1\\.title"]').fill("textqqq");

    // Create radio question
    await page.locator('[data-testid="questions-button-Choice"]').click();
    await page.locator('textarea[name="questions\\.2\\.title"]').click();
    await page.locator('textarea[name="questions\\.2\\.title"]').fill("radio third lol");

    await page
      .locator('text=Previewradio third lolRemove questionOptionalShow more >> input[type="text"]')
      .first()
      .click();

    await page.locator('input[name="questions\\.2\\.question_info\\.0\\.value"]').fill("radd11");

    await page
      .locator(
        'text=Previewradio third lolRemove optionRemove questionOptionalShow more >> input[type="text"]'
      )
      .first()
      .click();

    await page.locator('input[name="questions\\.2\\.question_info\\.1\\.value"]').fill("radd22");

    // Options tab
    await page.locator("text=Options").click();

    await page.locator('[placeholder="Pick a date"]').click();

    // Use tab to switch date
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
    }

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Enter");
    }

    await page.locator("text=19").last().click();

    // Click allow answers toggle
    await page.locator('[data-testid="allowAnswerEdit"]').click();

    await Promise.all([
      page.waitForNavigation(/*{ url: 'http://localhost:3000/dashboard' }*/),
      page.locator("text=Create draft").click()
    ]);

    await page.waitForLoadState("networkidle");

    ///////////////////////////////////////////////////////
    // test that new form exists and has correct data
    // + test that it can be edited
    const createdForm = page.locator(`a:has-text("tf-${dateString}")`).first();
    await expect(createdForm).toBeVisible();

    await Promise.all([page.locator(`text=tf-${dateString}`).click(), page.waitForNavigation()]);

    const titles = await page.locator(`text=tf-${dateString}`).count();
    expect(titles).toBe(2);
    const descriptions = await page.locator(`text=epicshortdescription`);
    expect(await descriptions.count()).toBe(2);

    // Edit title and description
    await page.locator('[data-testid="title-input"]').fill(`tf-EDIT-${dateString}`);
    await page.locator('[data-testid="description-input"]').fill(`epicshortdescription-EDIT`);

    await page.locator('button[role="tab"]:has-text("Post")').click();
    expect(await page.locator('textarea[name="postDescription"]').textContent()).toBe("pd");
    await page.locator('textarea[name="postDescription"]').fill(`pd-EDIT`);

    await page.locator('button[role="tab"]:has-text("Questions")').click();
    // Check that the values were restored correctly for future editing
    expect(
      page.locator("text=myfirstcheckboxquestion"),
      "first question title exists"
    ).toBeVisible();
    await page.locator("text=myfirstcheckboxquestion").fill(`myfirstcheckboxquestion-EDIT`);

    const firstQuestionFirstOption = await page.inputValue(
      'input[name="questions\\.0\\.question_info\\.0\\.value"]'
    );
    expect(
      firstQuestionFirstOption.includes("my check 1"),
      "first option for first question exists"
    ).toBeTruthy();
    await page
      .locator('input[name="questions\\.0\\.question_info\\.0\\.value"]')
      .fill(`my check 1 EDIT`);

    const firstQuestionSecondOption = await page.inputValue(
      'input[name="questions\\.0\\.question_info\\.1\\.value"]'
    );
    expect(
      firstQuestionSecondOption.includes("my check2"),
      "second option for first question exists"
    ).toBeTruthy();
    await page
      .locator('input[name="questions\\.0\\.question_info\\.1\\.value"]')
      .fill(`my check 2 EDIT`);

    expect(page.locator("text=textqqq"), "second question title exists").toBeVisible();
    await page.locator("text=textqqq").fill(`textqqq-EDIT`);

    expect(page.locator("text=radio third lol"), "third question title exists").toBeVisible();
    await page.locator("text=radio third lol").fill(`radio third lol EDIT`);

    const thirdQuestionFirstOption = await page.inputValue(
      'input[name="questions\\.2\\.question_info\\.0\\.value"]'
    );
    expect(
      thirdQuestionFirstOption.includes("radd11"),
      "first option for third question exists"
    ).toBeTruthy();
    await page
      .locator('input[name="questions\\.2\\.question_info\\.0\\.value"]')
      .fill(`radd11-EDIT`);

    const thirdQuestionSecondOption = await page.inputValue(
      'input[name="questions\\.2\\.question_info\\.1\\.value"]'
    );
    expect(
      thirdQuestionSecondOption.includes("radd22"),
      "first option for third question exists"
    ).toBeTruthy();
    await page
      .locator('input[name="questions\\.2\\.question_info\\.1\\.value"]')
      .fill(`radd22-EDIT`);

    await page.locator('[data-testid="questions-button-Freeform"]').click();
    await page.locator('textarea[name="questions\\.3\\.title"]').click();
    await page.locator('textarea[name="questions\\.3\\.title"]').fill("NEW optional text");
    await page.locator('label:has-text("Optional")').nth(3).click();

    await page.locator("text=Options").click();

    await expect(page.locator('[data-testid="allowAnswerHiddenInput"]')).toBeChecked();

    await page.locator('[data-testid="publishButton"]').click();

    await Promise.all([
      page.waitForNavigation(/*{ url: 'http://localhost:3000/dashboard' }*/),
      page.locator('[data-testid="confirmButton"]').click()
    ]);

    // check that form was published
    await page.goto("localhost:3000/forms");
    expect(await page.locator(`text=tf-EDIT-${dateString}`)).toBeVisible();

    await Promise.all([
      page.waitForNavigation(/*{ url: 'http://localhost:3000/dashboard' }*/),
      page.locator(`text=tf-EDIT-${dateString}`).click()
    ]);

    await page.locator("text=Info").click();
    expect(page.locator(`text=tf-EDIT-${dateString}`).first()).toBeVisible();
    expect(page.locator("text=pd-EDIT").first()).toBeVisible();

    await Promise.all([
      page.waitForNavigation(),
      page.locator('[data-testid="respondButton"]').click()
    ]);

    expect(page.locator("text=myfirstcheckboxquestion-EDIT")).toBeVisible();
    expect(page.locator("text=textqqq-EDIT")).toBeVisible();
    expect(page.locator("text=radio third lol EDIT")).toBeVisible();
    expect(page.locator("text=NEW optional text")).toBeVisible();
    expect(page.locator("text=my check 1 EDIT")).toBeVisible();

    await page.locator('[data-testid="submitResponseButton"]').click();

    const errors = await page.locator('[data-testid="errorMessage"]').count();
    expect(errors).toBe(3);

    await page.locator("text=my check 1 EDIT").click();
    await page.locator("text=my check 2 EDIT").click();

    await page.keyboard.press("Tab");
    await page.keyboard.type("TExtquestionanswer");

    await page.locator("text=radd22-EDIT").click();

    await Promise.all([
      page.locator('[data-testid="submitResponseButton"]').click(),
      page.waitForNavigation()
    ]);

    await page.goto("localhost:3000/answers");
    await page.waitForLoadState("networkidle");
    // check if answer was actually submitted
    expect(await page.locator(`text=tf-EDIT-${dateString}`)).toBeVisible();

    await Promise.all([
      page.waitForNavigation(/*{ url: 'http://localhost:3000/dashboard' }*/),
      page.locator(`text=tf-EDIT-${dateString}`).click()
    ]);
    // answers are rendered correctly
    expect(page.locator("text=myfirstcheckboxquestion-EDIT")).toBeVisible();
    expect(page.locator("text=my check 1 EDIT")).toBeVisible();
    expect(page.locator("text=my check 2 EDIT")).toBeVisible();
    await expect(page.locator("text=my check 1 EDIT")).toBeChecked();
    await expect(page.locator("text=my check 2 EDIT")).toBeChecked();

    expect(page.locator("text=textqqq-EDIT")).toBeVisible();
    const freeformAnswerText = await page.inputValue(
      'form div:has-text("textqqq-EDIT*") input[type="text"]'
    );
    expect(
      freeformAnswerText.includes("TExtquestionanswer"),
      "first option for third question exists"
    ).toBeTruthy();

    expect(page.locator("text=radio third lol EDIT")).toBeVisible();
    expect(page.locator("text=radd11-EDIT")).toBeVisible();
    expect(page.locator("text=radd22-EDIT")).toBeVisible();
    await expect(page.locator("text=radd22-EDIT")).toBeChecked();

    await page.locator("text=radd11-EDIT").click();

    await page
      .locator('form div:has-text("NEW optional text") input[type="text"]')
      .fill("OptionalTextFilled");

    await Promise.all([
      page.waitForNavigation(),
      page.locator('[data-testid="editSubmissionButton"]').click()
    ]);

    await page.goBack();

    // check that changes were saved

    await expect(page.locator("text=radd11-EDIT")).toBeChecked();

    const newOptionalAnswer = await page.inputValue(
      'form div:has-text("NEW optional text") input[type="text"]'
    );
    expect(
      newOptionalAnswer.includes("OptionalTextFilled"),
      "new optional answer was updated"
    ).toBeTruthy();

    await page.locator('[data-testid="deleteSubmissionButton"]').click();

    await Promise.all([
      page.waitForNavigation(),
      page.locator('[data-testid="confirmButton"]').click()
    ]);

    await page.screenshot({ path: `./e2e_screenshots/TEST.png` });
    const locator = await page.locator(`text=tf-EDIT-${dateString}`).isVisible();
    expect(locator, "the answer should NOT exist").toBeFalsy();
  });
});
