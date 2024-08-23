"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { randInt } from "@/utility/math";
import { DeepReadonly } from "@/utility/types";

import { Prefecture } from "../actions/prefectures";
import PrefectureButton from "./PrefectureButton";
import PopulationGraph from "./PopulationGraph";
import styles from "./Main.module.scss";

export interface PrefectureForPlot extends Prefecture {
  color: string;
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
    setPrefectures(
      prefectures_.map((pref) => ({
        ...pref,
        color: `hsl(${randInt(0, 360 + 1)}, ${randInt(0, 30 + 1) + 70}%, ${randInt(0, 20 + 1) + 50}%)`,
        plot: false,
      })),
    );
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
        {prefectures.map(({ code, name, color, plot }) => (
          <li key={code} className={styles["prefecture"]}>
            <PrefectureButton
              prefCode={code}
              prefName={name}
              prefColor={color}
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
