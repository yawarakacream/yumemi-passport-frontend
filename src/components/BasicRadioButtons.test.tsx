import { fireEvent, render, screen } from "@testing-library/react";

import BasicRadioButtons from "./BasicRadioButtons";

describe("BasicRadioButtons", () => {
  const choices = ["a", "b", "c"] as const;
  const currentIndex = 0;
  const nextIndex = 2;

  it("描画", async () => {
    render(
      <BasicRadioButtons current={choices[currentIndex]} choices={choices} />,
    );

    const buttons: any[] = await screen.findAllByRole("radio");

    buttons.forEach((b) => expect(b).toBeInstanceOf(HTMLInputElement));

    expect(buttons.length).toBe(choices.length);

    choices.forEach((c, i) => {
      expect(buttons[i].parentElement.textContent).toBe(c);
      expect(buttons[i].checked).toBe(i == currentIndex);
    });
  });

  it("選択", async () => {
    const onChange = jest.fn((choice) => choice);
    const { rerender } = render(
      <BasicRadioButtons
        current={choices[currentIndex]}
        choices={choices}
        onChange={onChange}
      />,
    );

    const buttons: any[] = await screen.findAllByRole("radio");

    fireEvent.click(buttons[nextIndex]);

    expect(onChange).toHaveBeenCalledWith(choices[nextIndex]);

    rerender(
      <BasicRadioButtons
        current={choices[nextIndex]}
        choices={choices}
        onChange={onChange}
      />,
    );

    choices.forEach((c, i) => {
      expect(buttons[i].checked).toBe(i == nextIndex);
    });
  });
});
