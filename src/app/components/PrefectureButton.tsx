"use client";

import { memo, useCallback } from "react";

import styles from "./PrefectureButton.module.scss";

interface Props {
  prefCode: number;
  prefName: string;
  prefColor: string;
  checked: boolean;
  onClick?: (prefCode: number) => void;
}

export default memo(function PrefectureButton({
  prefCode,
  prefName,
  prefColor,
  checked,
  onClick: onClick_,
}: Props) {
  const onClick = useCallback(() => {
    onClick_?.(prefCode);
  }, [onClick_, prefCode]);

  return (
    <button
      className={styles["container"]}
      style={{ background: checked ? prefColor : "none" }}
      onClick={onClick}
    >
      {prefName}
    </button>
  );
});
