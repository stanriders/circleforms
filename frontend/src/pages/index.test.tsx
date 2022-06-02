import { render } from "testUtils";

import Index from "./index";

describe("Index page", () => {
  it("should render", () => {
    render(<Index />);
    // render(<Index />);
    // expect(screen.("Circle Forms")).toBeInTheDocument();
  });
});
