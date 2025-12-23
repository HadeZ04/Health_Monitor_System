"use client";

import * as React from "react";

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number[];
  onValueChange: (value: number[]) => void;
}

export function Slider({ value, onValueChange }: SliderProps) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      value={value[0]}
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted"
      onChange={(event) => onValueChange([Number(event.target.value)])}
    />
  );
}
