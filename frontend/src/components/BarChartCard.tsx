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
    <div className="flex relative flex-col gap-y-6 justify-center px-14 pt-4 pb-6  min-h-[360px] text-clip bg-black-lighter rounded-35">
      <h2 className="text-2xl font-bold">{heading}</h2>
      <div className="flex flex-row items-center h-[360px]">
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
            <div key={item.questionIndex} className="flex gap-3 items-center">
              <span
                style={{ backgroundColor: getColorByIndex(index) }}
                className="aspect-square inline-block w-6 h-6 rounded-5"
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
