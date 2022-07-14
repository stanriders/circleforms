import userEvent from "@testing-library/user-event";
import { NextIntlProvider } from "next-intl";
import { render, screen } from "testUtils";

import createForm from "../../messages/create-a-form/en-US.json";
import globalMessages from "../../messages/global/en-US.json";

const messages = { ...globalMessages, ...createForm };

import CreateForm from "./CreateForm";

jest.mock("src/hooks/useAuth", () => ({
  __esModule: true,
  default: () => Promise.resolve({})
}));

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    };
  }
}));

describe("Create Form", () => {
  describe("Design Tab", () => {
    test("title preview works", async () => {
      const user = userEvent.setup();
      render(
        <NextIntlProvider locale="en" messages={messages}>
          <CreateForm />
        </NextIntlProvider>
      );

      const element = screen.getByTestId("title-input");
      await user.type(element, "Thisisatitle");
      const res = await screen.findAllByText("Thisisatitle");
      expect(res.length).toBe(2);
    });

    test("description preview works", async () => {
      const user = userEvent.setup();
      render(
        <NextIntlProvider locale="en" messages={messages}>
          <CreateForm />
        </NextIntlProvider>
      );

      const element = screen.getByTestId("description-input");
      await user.type(element, "Thisisadescription");
      const res = await screen.findAllByText("Thisisadescription");
      expect(res.length).toBe(2);
    });
  });

  describe("Questions Tab", () => {
    test("buttons in the toolbar work", async () => {
      const user = userEvent.setup();
      render(
        <NextIntlProvider locale="en" messages={messages}>
          <CreateForm />
        </NextIntlProvider>
      );

      const checkboxButton = screen.getByTestId("questions-button-Checkbox");
      const freeformButton = screen.getByTestId("questions-button-Freeform");
      const choiceButton = screen.getByTestId("questions-button-Choice");
      await user.click(checkboxButton);
      await user.click(freeformButton);
      await user.click(choiceButton);
      const res = screen.getAllByPlaceholderText("Write your question here");
      expect(res.length).toBe(3);
    });

    test("question can be deleted", async () => {
      const user = userEvent.setup();
      render(
        <NextIntlProvider locale="en" messages={messages}>
          <CreateForm />
        </NextIntlProvider>
      );

      const checkboxButton = screen.getByTestId("questions-button-Checkbox");

      await user.click(checkboxButton);

      const placeholders = screen.getAllByPlaceholderText("Write your question here");
      expect(placeholders.length).toBe(1);

      const removeButton = screen.getByTestId("remove-button");
      await user.click(removeButton);

      const placeholder = screen.queryByPlaceholderText("Write your question here");
      expect(placeholder).toBeNull();
    });
  });
});
