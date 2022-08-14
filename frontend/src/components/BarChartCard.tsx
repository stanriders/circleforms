import React from "react";
import { ResponsiveBar } from "@nivo/bar";

import { getColorByIndex } from "./FormStatistics";

type BarData = {
  questionIndex: string;
  questionText: string;
  count: number;
};

interface IBarChartCardInterface {
  data: BarData[];
  heading: string;
}

const BarChartCard = ({ data, heading }: IBarChartCardInterface) => {
  return (
    <div className="relative flex min-h-[360px] flex-col justify-center gap-y-6 text-clip rounded-35  bg-black-lighter px-14 pt-4 pb-6">
      <h2 className="text-2xl font-bold">{heading}</h2>
      <div className="flex h-[360px] flex-row items-center">
        <ResponsiveBar
          data={data}
          groupMode={"grouped"}
          keys={["count"]}
          indexBy="questionIndex"
          margin={{ top: 30, right: 30, bottom: 50, left: 30 }}
          padding={0.3}
          theme={{ textColor: "#ececec", background: "#131313" }}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={["#FF66AA", "#C270D4", "#FFE4F5", "#5C7EE4", "#007DA5", "#00716B"]}
          colorBy="indexValue"
          borderColor={{
            from: "color"
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendPosition: "middle",
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendPosition: "middle",
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "black"
          }}
          tooltip={({ id, value, color }) => (
            <div
              style={{
                padding: 12,
                color,
                background: "#222222"
              }}
            >
              <strong>
                {id}: {value}
              </strong>
            </div>
          )}
          role="application"
          ariaLabel={`Chart for ${heading}`}
          barAriaLabel={function (e) {
            return `Vote count is ${e.data.count} for ${e.data.questionText}`;
          }}
        />
        <div className="flex flex-col gap-4">
          {data.map((item, index) => (
            <div key={item.questionIndex} className="flex items-center gap-3">
              <span
                style={{ backgroundColor: getColorByIndex(index) }}
                className="inline-block aspect-square h-6 w-6 rounded-5"
              />
              <p className="">
                {item.questionIndex}. {item.questionText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChartCard;
