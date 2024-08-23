import { getPrefectures } from "./actions/prefectures";
import Main from "./components/Main";

export default async function Home() {
  const prefectures = await getPrefectures();
  return <Main prefectures={prefectures} />;
}
