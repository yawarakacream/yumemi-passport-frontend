import { memo, useEffect, useState } from "react";
import Highcharts from "highcharts";
import "highcharts/css/highcharts.css";
import { HighchartsReact } from "highcharts-react-official";

import { DeepReadonly } from "@/utilities/typing";

import styles from "./LineChart.module.scss";

export interface LineChartSeries {
  name: string;
  ys: { [x in string]?: number };
  color: string;
  lineStyle?: "solid" | "dash";
  markerSymbol?: string;
}

const convertToDashStyle = (
  dashStyle: LineChartSeries["lineStyle"],
): Highcharts.DashStyleValue | undefined => {
  if (dashStyle === undefined) return undefined;
  return ({ solid: "Solid", dash: "Dash" } as const)[dashStyle];
};

interface Props {
  xs: DeepReadonly<string[]>;
  series: DeepReadonly<LineChartSeries[]>;
  formatY?: (y: number) => string;
}

export default memo(function LineChart({
  xs,
  series,
  formatY = (y) => y.toString(),
}: Props) {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>();

  useEffect(() => {
    if (xs.length === 0) {
      setChartOptions(undefined);
      return;
    }

    const x2index = xs.reduce(
      (x2index, x, i) => {
        x2index[x] = i;
        return x2index;
      },
      {} as { [key in string]: number },
    );

    setChartOptions({
      title: undefined,
      legend: {
        enabled: false,
      },
      xAxis: {
        categories: [...xs],
        lineWidth: 0,
        labels: {
          style: {
            fontSize: "1em",
            color: "rgb(var(--foreground-rgb))",
          },
        },
      },
      yAxis: {
        title: undefined,
        labels: {
          style: {
            fontSize: "1em",
            color: "rgb(var(--foreground-rgb))",
          },
          formatter: function () {
            if (typeof this.value !== "number") {
              throw new Error(`Invalid y given: ${this.value}`);
            }
            return formatY(this.value);
          },
        },
      },
      series: series.map(
        ({
          name,
          ys,
          color: lineColor,
          lineStyle = "solid",
          markerSymbol = "circle",
        }) => ({
          name,
          type: "line",
          dashStyle: convertToDashStyle(lineStyle),
          marker: { symbol: markerSymbol },
          color: lineColor,
          data: Object.entries(ys).reduce(
            (array, [x, y]) => {
              if (!(x in x2index)) {
                throw new Error(`Invalid x given: (${x}, ${y})`);
              }

              if (typeof y !== "number") {
                throw new Error(`Invalid y given: (${x}, ${y})`);
              }

              array[x2index[x]] = y;
              return array;
            },
            Array(xs.length).fill(null) as (number | null)[],
          ),
        }),
      ),
      tooltip: {
        style: {
          fontSize: "1em",
          color: "rgb(var(--foreground-rgb))",
        },
        formatter: function () {
          if (this.point.y === undefined) return;
          return `<strong>${this.series.name}</strong><br />${formatY(this.point.y)}`;
        },
      },
    });
  }, [xs, series, formatY]);

  return (
    <div className={styles["container"]}>
      {chartOptions && (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </div>
  );
});
