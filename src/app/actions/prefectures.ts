"use server";

import {
  getResasPopulationCompositionPerYear,
  getResasPrefectures,
} from "@/app/actions/resas";

const POPULATION_LABELS = [
  "総人口",
  "年少人口",
  "生産年齢人口",
  "老年人口",
] as const;

/**
 * 都道府県
 */
export interface Prefecture {
  code: number;
  name: string;
  population: {
    boundaryYear: number; // 実績値と推計値の区切り年
    data: {
      [label in (typeof POPULATION_LABELS)[number]]: {
        year: number;
        value: number;
        rate?: number;
      }[];
    };
  };
}

const isPrefecture = (object: unknown): object is Prefecture => {
  if (object === null) return false;
  if (typeof object !== "object") return false;

  if (!("code" in object)) return false;
  if (typeof object.code !== "number") return false;

  if (!("name" in object)) return false;
  if (typeof object.name !== "string") return false;

  if (!("population" in object)) return false;
  if (object.population === null) return false;
  if (typeof object.population !== "object") return false;

  {
    if (!("boundaryYear" in object.population)) return false;
    if (typeof object.population.boundaryYear !== "number") return false;

    if (!("data" in object.population)) return false;
    if (!isPrefecturePopulationData(object.population.data)) return false;
  }

  return true;
};

const isPrefecturePopulationData = (
  object: unknown,
): object is Prefecture["population"]["data"] => {
  if (object === null) return false;
  if (typeof object !== "object") return false;

  const entries = Object.entries(object);
  if (entries.length !== 4) return false;
  if (
    !entries.every(([label, data]) => {
      if (!POPULATION_LABELS.includes(label as any)) return false;

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

          if (!POPULATION_LABELS.includes(curr.label as any)) {
            return acc;
          }

          acc[curr.label as (typeof POPULATION_LABELS)[number]] = curr.data;

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

      if (!isPrefecture(prefecture)) {
        throw new Error(`Invalid prefecture: ${JSON.stringify(prefecture)}`);
      }

      return prefecture;
    }),
  );

  return prefectures;
}
