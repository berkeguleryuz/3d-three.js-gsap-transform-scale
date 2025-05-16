import React from "react";
import SwatchWrapper from "./SwatchWrapper";
import { DataType } from "../types";

interface CanvasProps {
  activeData: DataType;
  swatchData: DataType[];
  onSwatchSelect: (selectedItem: DataType) => void;
}

const Canvas = ({ activeData, swatchData, onSwatchSelect }: CanvasProps) => {
  const handleItemSelection = (itemId: number) => {
    const selectedItem = swatchData.find((item) => item.id === itemId);
    if (selectedItem) {
      onSwatchSelect(selectedItem);
    }
  };

  return (
    <div className="w-full h-3/5 relative flex justify-center items-end p-4 lg:w-1/2 lg:h-full lg:items-center">
      <SwatchWrapper
        items={swatchData}
        activeItemId={activeData.id}
        onItemClick={handleItemSelection}
      />
    </div>
  );
};

export default Canvas;
