import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AllTheProviders } from "src/utils/providers";

import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
