"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { DeepReadonly } from "@/utility/types";

import { Prefecture } from "../actions/prefectures";
import PrefectureButton from "./PrefectureButton";
import PopulationGraph from "./PopulationGraph";
import styles from "./Main.module.scss";

export interface PrefectureForPlot extends Prefecture {
  plot: boolean;
}

interface Props {
  prefectures: DeepReadonly<Prefecture[]>;
}

export default memo(function Main({ prefectures: prefectures_ }: Props) {
  const [prefectures, setPrefectures] = useState<
    DeepReadonly<PrefectureForPlot[]>
  >([]);

  useEffect(() => {
    setPrefectures(prefectures_.map((pref) => ({ ...pref, plot: false })));
  }, [prefectures_]);

  const onPrefectureButtonClick = useCallback((prefCode: number) => {
    setPrefectures((prefectures) => {
      return prefectures.map((pref) => {
        if (pref.code !== prefCode) return pref;
        return { ...pref, plot: !pref.plot };
      });
    });
  }, []);

  return (
    <main className={styles["main"]}>
      <ul className={styles["prefecture-list"]}>
        {prefectures.map(({ code, name, plot }) => (
          <li key={code} className={styles["prefecture"]}>
            <PrefectureButton
              prefCode={code}
              prefName={name}
              checked={plot}
              onClick={onPrefectureButtonClick}
            />
          </li>
        ))}
      </ul>
      <div className={styles["population-graph-wrapper"]}>
        <PopulationGraph populationLabel="総人口" prefectures={prefectures} />
      </div>
    </main>
  );
});
