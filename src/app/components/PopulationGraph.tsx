import { memo, useEffect, useState } from "react";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";

import { DeepReadonly } from "@/utility/types";

import { PopulationLabel } from "../actions/prefectures";
import { PrefectureForPlot } from "./Main";

interface Props {
  populationLabel: PopulationLabel;
  prefectures: DeepReadonly<PrefectureForPlot[]>;
}

export default memo(function PopulationGraph({
  populationLabel,
  prefectures,
}: Props) {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>();

  useEffect(() => {
    const xAxis: Highcharts.Options["xAxis"] = [];
    const series: Highcharts.Options["series"] = [];

    prefectures
      .filter((pref) => pref.plot)
      .forEach((pref) => {
        const data = pref.population.data[populationLabel];
        const xs = data.map(({ year }) => `${year}`);
        const ys = data.map(({ value }) => value);

        xAxis.push({
          categories: xs,
          lineWidth: 0,
        });
        series.push({
          name: pref.name,
          type: "line",
          data: ys,
        });
      });

    setChartOptions({
      title: undefined,
      xAxis,
      yAxis: {
        title: undefined,
        labels: {
          formatter: (ctx) => ctx.value.toLocaleString(),
        },
      },
      series,
    });
  }, [populationLabel, prefectures]);

  return (
    chartOptions && (
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    )
  );
});
