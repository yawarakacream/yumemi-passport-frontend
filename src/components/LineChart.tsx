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
  xUnit?: string;
  yUnit?: string;
  minWidth?: number;
  minHeight?: number;
}

export default memo(function LineChart({
  xs,
  series,
  formatY = (y) => y.toString(),
  xUnit,
  yUnit,
  minWidth,
  minHeight,
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

    const style: Highcharts.CSSObject = {
      fontSize: "1rem",
      fontFamily: "monospace",
      color: "rgb(var(--foreground-rgb))",
    };

    // TODO: マジックナンバーばかりなのでなんとかする
    setChartOptions({
      title: undefined,
      chart: {
        marginTop: 48,
        scrollablePlotArea: { minWidth, minHeight },
      },
      legend: { enabled: false },
      xAxis: {
        categories: [...xs],
        title:
          xUnit === undefined
            ? undefined
            : {
                text: `[${xUnit}]`,
                align: "high",
                x: -8,
                y: -1,
                style,
              },
        lineWidth: 0,
        labels: { style },
        scrollbar: { enabled: minWidth !== undefined },
      },
      yAxis: {
        title:
          yUnit === undefined
            ? undefined
            : {
                text: `[${yUnit}]`,
                align: "high",
                margin: 0,
                offset: 0,
                rotation: 0,
                x: -12,
                y: -24,
                style,
              },
        labels: {
          style,
          formatter: function () {
            if (typeof this.value !== "number") {
              throw new Error(`Invalid y given: ${this.value}`);
            }
            return formatY(this.value);
          },
        },
        scrollbar: { enabled: minHeight !== undefined },
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
        style,
        formatter: function () {
          if (this.point.y === undefined) return;

          let displayX = xs[this.point.x];
          if (xUnit !== undefined) displayX += ` ${xUnit}`;

          let displayY = formatY(this.point.y);
          if (yUnit !== undefined) displayY += ` ${yUnit}`;

          return `<strong>${this.series.name}</strong><br />${displayX} : ${displayY}`;
        },
      },
    });
  }, [xs, series, formatY, xUnit, yUnit, minWidth, minHeight]);

  return (
    <div className={styles["container"]}>
      {chartOptions && (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </div>
  );
});
