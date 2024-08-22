/**
 * RESAS-API を呼び出す
 *
 * @see https://opendata.resas-portal.go.jp/docs/api/v1/index.html
 *
 * @param url リクエスト URL
 * @param cache キャッシュする時間 [秒]
 * @returns レスポンスの `result`
 */
async function callResasApi(
  endpoint: `/api/${string}`,
  parameters: { [key: string]: any },
  cache: number,
): Promise<NonNullable<unknown>> {
  if (!process.env.RESAS_API_KEY) {
    throw new Error(`Environment variable "RESAS_API_KEY" is missing`);
  }

  const options: Partial<RequestInit> = {
    headers: {
      method: "GET",
      "X-API-KEY": process.env.RESAS_API_KEY,
    },
  };

  if (cache <= 0) {
    options.cache = "no-cache";
  } else {
    options.next ??= {};
    options.next.revalidate = Number.isFinite(cache) ? cache : false;
  }

  const query = new URLSearchParams(parameters);
  const url = `https://opendata.resas-portal.go.jp${endpoint}?${query}`;
  const response = await fetch(url, options);

  const body = await response.json();

  // body.message === null ならば正常
  if (body.message !== null) {
    throw new Error(
      `Failed to fetch RESAS-API: url=${url}, body=${JSON.stringify(body)}`,
    );
  }

  if (body.result === undefined || body.result === null) {
    throw new Error(
      `Failed to fetch RESAS-API: "result" is missing: url=${url}, body=${JSON.stringify(body)}`,
    );
  }

  return body.result;
}

/**
 * @see https://opendata.resas-portal.go.jp/docs/api/v1/prefectures.html
 */
export async function getResasPrefectures(): Promise<ResasPrefecture[]> {
  const prefectures = await callResasApi(
    "/api/v1/prefectures",
    {},
    60 * 60 * 24,
  ); // 1 日間キャッシュ

  if (!Array.isArray(prefectures)) throw new Error();
  if (!prefectures.every((p) => isResasPrefecture(p))) throw new Error();

  return prefectures;
}

export interface ResasPrefecture {
  prefCode: number;
  prefName: string;
}

const isResasPrefecture = (object: unknown): object is ResasPrefecture => {
  if (object === null) return false;
  if (typeof object !== "object") return false;

  if (!("prefCode" in object)) return false;
  if (typeof object.prefCode !== "number") return false;

  if (!("prefName" in object)) return false;
  if (typeof object.prefName !== "string") return false;

  return true;
};
