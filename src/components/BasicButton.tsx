import { memo } from "react";

import styles from "./BasicButton.module.scss";

interface Props {
  children: string;
  background?: string;
  onClick?: () => void;
}

export default memo(function BasicButton({
  children,
  background,
  onClick,
}: Props) {
  return (
    <button
      className={styles["container"]}
      style={{ background: background }}
      onClick={onClick}
    >
      {children}
    </button>
  );
});
