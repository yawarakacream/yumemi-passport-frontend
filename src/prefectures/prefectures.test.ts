import { isPrefecturePopulationData } from "./prefectures";

describe("isPrefecturePopulationData", () => {
  it("成功例", () => {
    expect(
      isPrefecturePopulationData({
        総人口: [{ year: 2020, value: 1000000 }],
        年少人口: [{ year: 2020, value: 1000000 }],
        生産年齢人口: [{ year: 2020, value: 1000000 }],
        老年人口: [{ year: 2020, value: 1000000 }],
      }),
    ).toBe(true);
  });

  it("老年人口がない", () => {
    expect(
      isPrefecturePopulationData({
        総人口: [{ year: 2020, value: 1000000 }],
        年少人口: [{ year: 2020, value: 1000000 }],
        生産年齢人口: [{ year: 2020, value: 1000000 }],
      }),
    ).toBe(false);
  });

  it("総人口.year が string", () => {
    expect(
      isPrefecturePopulationData({
        総人口: [{ year: "2020", value: 1000000 }],
        年少人口: [{ year: 2020, value: 1000000 }],
        生産年齢人口: [{ year: 2020, value: 1000000 }],
        老年人口: [{ year: 2020, value: 1000000 }],
      }),
    ).toBe(false);
  });

  it("総人口.value が string", () => {
    expect(
      isPrefecturePopulationData({
        総人口: [{ year: 2020, value: "1000000" }],
        年少人口: [{ year: 2020, value: 1000000 }],
        生産年齢人口: [{ year: 2020, value: 1000000 }],
        老年人口: [{ year: 2020, value: 1000000 }],
      }),
    ).toBe(false);
  });

  it("成功例: 総人口.rate 付き", () => {
    expect(
      isPrefecturePopulationData({
        総人口: [{ year: 2020, value: 1000000, rate: 50 }],
        年少人口: [{ year: 2020, value: 1000000 }],
        生産年齢人口: [{ year: 2020, value: 1000000 }],
        老年人口: [{ year: 2020, value: 1000000 }],
      }),
    ).toBe(true);
  });

  it("総人口.rate が string", () => {
    expect(
      isPrefecturePopulationData({
        総人口: [{ year: 2020, value: 1000000, rate: "50" }],
        年少人口: [{ year: 2020, value: 1000000 }],
        生産年齢人口: [{ year: 2020, value: 1000000 }],
        老年人口: [{ year: 2020, value: 1000000 }],
      }),
    ).toBe(false);
  });

  it("空のオブジェクト", () => {
    expect(isPrefecturePopulationData({})).toBe(false);
  });

  it("number", () => {
    expect(isPrefecturePopulationData(-1)).toBe(false);
  });

  it("boolean", () => {
    expect(isPrefecturePopulationData(true)).toBe(false);
  });

  it("null", () => {
    expect(isPrefecturePopulationData(null)).toBe(false);
  });

  it("undefined", () => {
    expect(isPrefecturePopulationData(undefined)).toBe(false);
  });
});
