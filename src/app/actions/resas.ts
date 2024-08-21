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
  url: string,
  cache: number
): Promise<NonNullable<unknown>> {
  if (!process.env.RESAS_API_KEY) {
    throw new Error("Environment variable `RESAS_API_KEY` is missing");
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

  const response = await fetch(
    `https://opendata.resas-portal.go.jp/${url}`,
    options
  );

  if (response.status !== 200) {
    console.log(response);
    throw new Error("Failed to fetch RESAS-API");
  }

  const body = await response.json();

  // 200 のときは message は常に null っぽい
  if (body.message !== null) {
    console.log(response);
    throw new Error(
      "Failed to fetch RESAS-API: `message` is not null for status code 200"
    );
  }

  if (body.result === undefined || body.result === null) {
    throw new Error("Failed to fetch RESAS-API: `result` is missing");
  }

  return body.result;
}

/**
 * @see https://opendata.resas-portal.go.jp/docs/api/v1/prefectures.html
 */
export async function getResasPrefectures(): Promise<ResasPrefecture[]> {
  const prefectures = await callResasApi("api/v1/prefectures", 60 * 60 * 24); // 1 日間キャッシュ

  if (!Array.isArray(prefectures)) throw new Error();
  if (!prefectures.every((p) => isResasPrefecture(p))) console.log(prefectures);

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
