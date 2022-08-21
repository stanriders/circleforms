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
  return (
    <div className="relative flex min-h-[360px] flex-col justify-center gap-y-6 text-clip rounded-35 bg-black-lighter px-14 pt-4 pb-6">
      <h2 className="text-2xl font-bold">{heading}</h2>
      <div className="m-auto flex items-center gap-28">
        <PieChart
          style={{ maxWidth: "250px", minWidth: "250px" }}
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
            <div key={pieEntry.title} className="flex items-center gap-2">
              <span
                style={{ backgroundColor: getColorByIndex(index) }}
                className="inline-block aspect-square h-6 w-6 rounded-5"
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
