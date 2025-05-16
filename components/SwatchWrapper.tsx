import React from "react";
import SingleSwatchCircle from "./SingleSwatchCircle";
import { DataType } from "../types";

interface SwatchWrapperProps {
  items: DataType[];
  activeItemId: number;
  onItemClick: (id: number) => void;
}

const SwatchWrapper = ({
  items,
  activeItemId,
  onItemClick,
}: SwatchWrapperProps) => {
  const handleSwitchClicked = (id: number) => {
    onItemClick(id);
  };

  return (
    <div className="h-fit absolute z-20 w-full bottom-0 flex justify-center gap-8 mb-2 lg:w-fit lg:inset-y-[40%] lg:right-20 lg:flex-col">
      {items.map((item) => (
        <SingleSwatchCircle
          key={item.id}
          activeId={activeItemId}
          item={item}
          handleClick={handleSwitchClicked}
        />
      ))}
    </div>
  );
};

export default SwatchWrapper;
