import React from "react";

const RadioItem = () => {
  return (
    <div className="flex gap-x-2 items-center">
      <div className="h-6 w-6 rounded-full border-2" />
      <input className="input--inline input--static" type="text" readOnly />
    </div>
  );
};

export default RadioItem;
