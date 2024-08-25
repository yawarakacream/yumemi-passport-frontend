import { populationLabels, getPrefectures } from "@/prefectures/prefectures";

import Main from "./components/Main";

export default async function Home() {
  const prefectures = await getPrefectures();
  return <Main populationLabels={populationLabels} prefectures={prefectures} />;
}
