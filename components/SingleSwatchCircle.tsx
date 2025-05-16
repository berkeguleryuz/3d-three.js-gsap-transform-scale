import React from "react";
import { DataType } from "../types";

const SingleSwatchCircle = ({
  activeId,
  item,
  handleClick,
}: {
  activeId: number;
  item: DataType;
  handleClick: (id: number) => void;
}) => {
  return (
    <div
      className={`cursor-pointer size-9 p-1 rounded-full drop-shadow-xl bg-white transition ease-in hover:scale-110 ${
        item.id === activeId ? "scale-125" : ""
      }`}
      onClick={() => handleClick(item.id)}>
      <div
        style={{ backgroundColor: item.background }}
        className="size-full rounded-full"
      />
    </div>
  );
};

export default SingleSwatchCircle;
