"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { DeepReadonly } from "@/utility/types";

import { Prefecture } from "../actions/prefectures";
import styles from "./Main.module.scss";
import PrefectureButton from "./PrefectureButton";

interface Props {
  prefectures: DeepReadonly<Prefecture[]>;
}

export default memo(function Main({ prefectures: prefectures_ }: Props) {
  const [prefectures, setPrefectures] = useState<
    DeepReadonly<(Prefecture & { plot: boolean })[]>
  >([]);

  useEffect(() => {
    setPrefectures(prefectures_.map((pref) => ({ ...pref, plot: false })));
  }, [prefectures_]);

  const onPrefectureButtonClick = useCallback((prefCode: number) => {
    setPrefectures((prefectures) => {
      return prefectures.map((pref) => {
        if (pref.prefCode !== prefCode) return pref;
        return { ...pref, plot: !pref.plot };
      });
    });
  }, []);

  return (
    <main className={styles["main"]}>
      <ul className={styles["prefecture-list"]}>
        {prefectures.map(({ prefCode, prefName, plot }) => (
          <li key={prefCode} className={styles["prefecture"]}>
            <PrefectureButton
              prefCode={prefCode}
              prefName={prefName}
              checked={plot}
              onClick={onPrefectureButtonClick}
            />
          </li>
        ))}
      </ul>
    </main>
  );
});
