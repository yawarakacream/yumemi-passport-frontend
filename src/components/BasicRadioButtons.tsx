import { ChangeEventHandler, memo, useCallback, useId } from "react";

import styles from "./BasicRadioButtons.module.scss";

interface Props<C extends T, T extends string> {
  current: C;
  choices: Readonly<T[]>;
  onChange?: (choice: T) => void;
}

// TODO: useImperativeHandle で扱えるようにする
function BasicRadioButtons<C extends T, T extends string>({
  current,
  choices,
  onChange,
}: Props<C, T>) {
  const choiceRadioName = useId();

  const onChoiceChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => onChange?.(event.target.value as T),
    [onChange],
  );

  return (
    <form className={styles["container"]}>
      {choices.map((choice) => (
        <label key={choice} className={styles["choice"]}>
          <input
            type="radio"
            name={choiceRadioName}
            value={choice}
            checked={choice === current}
            onChange={onChoiceChange}
          />
          <span>{choice}</span>
        </label>
      ))}
    </form>
  );
}

// memo で囲むとジェネリクスが消えてしまう
export default memo(BasicRadioButtons) as typeof BasicRadioButtons;
