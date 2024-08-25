import { ComponentProps, memo, useCallback, useEffect, useState } from "react";

import LineChart, { LineChartSeries } from "@/components/LineChart";
import { DeepReadonly } from "@/utility/types";

import { PopulationLabel } from "../../prefectures/prefectures";
import { PrefectureForPlot } from "./Main";

interface Props {
  populationLabel: PopulationLabel;
  prefectures: DeepReadonly<PrefectureForPlot[]>;
}

export default memo(function PopulationGraph({
  populationLabel,
  prefectures,
}: Props) {
  const [chartOptions, setChartOptions] = useState<
    DeepReadonly<{
      xs: ComponentProps<typeof LineChart>["xs"];
      series: ComponentProps<typeof LineChart>["series"];
    }>
  >();

  useEffect(() => {
    const xs: Set<string> = new Set();
    const series: LineChartSeries[] = [];

    prefectures
      .filter((pref) => pref.plot)
      .forEach((pref) => {
        const data = pref.population.data[populationLabel];

        const actualYs: { [x in string]?: number } = {};
        const predYs: { [x in string]?: number } = {};

        let lastActualYs: number | undefined = undefined;
        let yearOfLastActualYs = -1;

        data.forEach(({ year, value }) => {
          const x = year.toString();
          xs.add(x);

          const y = value;
          if (year <= pref.population.boundaryYear) {
            actualYs[x] = y;

            if (yearOfLastActualYs < year) {
              lastActualYs = y;
              yearOfLastActualYs = year;
            }
          } else {
            predYs[x] = y;
          }
        });

        // 実績値から予測値へ破線を繋げるために
        // 実績値の最後の値を予測値に入れる
        if (lastActualYs !== undefined) {
          predYs[yearOfLastActualYs.toString()] = lastActualYs;
        }

        // 実績値を予測値の上に重ねる
        series.push({
          name: `${pref.name} (予測値)`,
          ys: predYs,
          color: pref.color,
          lineStyle: "dash",
        });
        series.push({
          name: pref.name,
          ys: actualYs,
          color: pref.color,
        });
      });

    setChartOptions({ xs: Array.from(xs), series });
  }, [populationLabel, prefectures]);

  const formatY = useCallback((y: number) => y.toLocaleString(), []);

  return chartOptions && <LineChart formatY={formatY} {...chartOptions} />;
});
