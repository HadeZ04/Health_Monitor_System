"use client";

import * as React from "react";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: number[];
  onValueChange: (value: number[]) => void;
}

export function Slider({ value, onValueChange, ...props }: SliderProps) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      value={value[0] ?? 0}
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted"
      onChange={(event) => onValueChange([Number(event.target.value)])}
      {...props}
    />
  );
}
