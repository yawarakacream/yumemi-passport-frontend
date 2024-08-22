"use server";

import { getResasPrefectures, ResasPrefecture } from "@/app/actions/resas";

/**
 * 都道府県
 */
export interface Prefecture extends ResasPrefecture {}

/**
 * すべての都道府県のリストを取得する
 *
 * @returns 都道府県のリスト
 */
export async function getPrefectures(): Promise<Prefecture[]> {
  return await getResasPrefectures();
}
