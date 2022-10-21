import { render, screen } from "@testing-library/react";
import Dashboard  from '../dashboard';

describe("when rendered with a `name` prop", () => {
  it("should paste it into the greetings text", () => {
    const {container} = render(Dashboard);
    const boxes = container.getElementsByClassName("css-vshaxh");
    expect(boxes.length).toEqual(2);
  });
});