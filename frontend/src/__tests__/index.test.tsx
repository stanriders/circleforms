import { NextIntlProvider } from "next-intl";
import { render, screen } from "testUtils";

import globalMessages from "../messages/global/en-US.json";
import indexMessages from "../messages/index/en-US.json";

const messages = { ...globalMessages, ...indexMessages };

import Index from "../pages/index";

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

describe("Index page", () => {
  it("should render", async () => {
    render(
      <NextIntlProvider locale="en" messages={messages}>
        <Index />
      </NextIntlProvider>
    );
    const title = await screen.findAllByText("Circle Forms");

    expect(title[0]).toBeInTheDocument();
  });
});
