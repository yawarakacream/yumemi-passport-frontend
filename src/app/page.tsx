import { getPrefectures } from "./actions/prefectures";
import Main from "./components/Main";

export default async function Home() {
  const prefectures = await getPrefectures();
  return (
    <Main
      populationLabels={["総人口", "年少人口", "生産年齢人口", "老年人口"]}
      prefectures={prefectures}
    />
  );
}
