import React from "react";
import { PieChart } from "react-minimal-pie-chart";

import { getColorByIndex } from "./FormStatistics";

type DataEntry = {
  title: string;
  value: number;
  color: string;
};
interface IPieChartCard {
  heading: string;
  data: Array<DataEntry>;
}

const defaultLabelStyle = {
  fontSize: "0.5rem",
  fontFamily: "sans-serif"
};

const PieChartCard = ({ heading, data }: IPieChartCard) => {
  console.log("data:", data);

  return (
    <div className="flex relative flex-col gap-y-6 justify-center px-14 pt-4 pb-6 min-h-[360px] text-clip bg-black-lighter rounded-35">
      <h2 className="text-2xl font-bold">{heading}</h2>
      <div className="flex gap-28">
        <PieChart
          style={{ maxWidth: "250px" }}
          label={({ dataEntry }) =>
            dataEntry.percentage ? Math.round(dataEntry.percentage) + "%" : null
          }
          labelStyle={{
            ...defaultLabelStyle
          }}
          data={data}
        />

        <div className="flex flex-col gap-4">
          {data.map((pieEntry, index) => (
            <div key={pieEntry.title} className="flex gap-2">
              <span
                style={{ backgroundColor: getColorByIndex(index) }}
                className="inline-block w-6 h-6 rounded-5"
              />
              <p className="">{pieEntry.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartCard;
