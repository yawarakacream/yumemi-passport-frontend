"use client";

import { useCallback, useEffect, useState } from "react";

import { DeepReadonly } from "@/utility/types";

import styles from "./page.module.scss";
import { getPrefectures, Prefecture } from "./actions/prefectures";
import PrefectureButton from "./components/PrefectureButton";

export default function Home() {
  const [prefectures, setPrefectures] = useState<
    DeepReadonly<(Prefecture & { plot: boolean })[]>
  >([]);

  useEffect(() => {
    (async () => {
      const prefectures = await getPrefectures();
      setPrefectures(prefectures.map((p) => ({ ...p, plot: false })));
    })();
  }, []);

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
}
