import React from "react";
import renderer from "react-test-renderer";

import Index from "../pages/index";

describe("Home", () => {
  it("renders homepage unchanged", () => {
    const tree = renderer.create(<Index />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
