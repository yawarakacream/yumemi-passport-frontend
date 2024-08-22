"use server";

import {
  getResasPopulationCompositionPerYear,
  getResasPrefectures,
} from "@/app/actions/resas";

const populationLabels = [
  "総人口",
  "年少人口",
  "生産年齢人口",
  "老年人口",
] as const;

export type PopulationLabel = (typeof populationLabels)[number];

/**
 * 都道府県
 */
export interface Prefecture {
  code: number;
  name: string;
  population: {
    boundaryYear: number; // 実績値と推計値の区切り年
    data: {
      [label in PopulationLabel]: {
        year: number;
        value: number;
        rate?: number;
      }[];
    };
  };
}

const isPrefecturePopulationData = (
  object: unknown,
): object is Prefecture["population"]["data"] => {
  if (object === null) return false;
  if (typeof object !== "object") return false;

  const entries = Object.entries(object);
  if (entries.length !== 4) return false;
  if (
    !entries.every(([label, data]) => {
      if (!populationLabels.includes(label as any)) return false;

      if (!Array.isArray(data)) return false;
      if (
        !data.every((object) => {
          if (!("year" in object)) return false;
          if (typeof object.year !== "number") return false;

          if (!("value" in object)) return false;
          if (typeof object.value !== "number") return false;

          if ("rate" in object) {
            if (typeof object.rate !== "number") return false;
          }

          return true;
        })
      ) {
        return false;
      }

      return true;
    })
  ) {
    return false;
  }

  return true;
};

/**
 * すべての都道府県のデータを取得する
 *
 * @returns 都道府県のデータのリスト
 */
export async function getPrefectures(): Promise<Prefecture[]> {
  const resasPrefectures = await getResasPrefectures();

  const prefectures: Prefecture[] = await Promise.all(
    resasPrefectures.map(async ({ prefCode, prefName }) => {
      const pcpy = await getResasPopulationCompositionPerYear(prefCode);

      const populationData = pcpy.data.reduce(
        (acc, curr) => {
          if (curr.label in acc) {
            throw new Error(`Duplicate labels: ${curr}`);
          }

          if (!populationLabels.includes(curr.label as any)) {
            return acc;
          }

          acc[curr.label as (typeof populationLabels)[number]] = curr.data;

          return acc;
        },
        {} as Partial<Prefecture["population"]["data"]>,
      );

      if (!isPrefecturePopulationData(populationData)) {
        throw new Error(
          `Invalid prefecture population data: ${JSON.stringify(populationData)}`,
        );
      }

      const prefecture = {
        code: prefCode,
        name: prefName,
        population: {
          boundaryYear: pcpy.boundaryYear,
          data: populationData,
        },
      };

      return prefecture;
    }),
  );

  return prefectures;
}
