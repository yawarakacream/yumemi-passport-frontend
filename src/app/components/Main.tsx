"use client";

import { memo, useCallback, useEffect, useState } from "react";

import BasicRadioButtons from "@/components/BasicRadioButtons";
import { PopulationLabel, Prefecture } from "@/prefectures/prefectures";
import { randInt } from "@/utilities/math";
import { DeepReadonly } from "@/utilities/typing";

import PopulationGraph from "./PopulationGraph";
import PrefectureButton from "./PrefectureButton";
import styles from "./Main.module.scss";

export interface PrefectureForPlot extends Prefecture {
  color: string;
  plot: boolean;
}

interface Props {
  prefectures: DeepReadonly<Prefecture[]>;
  populationLabels: DeepReadonly<PopulationLabel[]>;
}

const prefecturesPlottedByDefault = ["東京都"];

export default memo(function Main({
  prefectures: prefectures_,
  populationLabels,
}: Props) {
  const [prefectures, setPrefectures] = useState<
    DeepReadonly<PrefectureForPlot[]>
  >([]);

  const [currentPopulationLabel, setCurrentPopulationLabel] =
    useState<PopulationLabel>(populationLabels[0]);

  useEffect(() => {
    setPrefectures(
      prefectures_.map((pref) => ({
        ...pref,
        color: `hsl(${randInt(0, 360 + 1)}, ${randInt(0, 30 + 1) + 70}%, ${randInt(0, 20 + 1) + 50}%)`,
        plot: prefecturesPlottedByDefault.includes(pref.name),
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
      <ul className={styles["prefectures-list"]}>
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
      <div className={styles["population-label-selector-wrapper"]}>
        <BasicRadioButtons
          current={currentPopulationLabel}
          choices={populationLabels}
          onChange={setCurrentPopulationLabel}
        />
      </div>
      <div className={styles["population-graph-wrapper"]}>
        <PopulationGraph
          populationLabel={currentPopulationLabel}
          prefectures={prefectures}
        />
      </div>
    </main>
  );
});
