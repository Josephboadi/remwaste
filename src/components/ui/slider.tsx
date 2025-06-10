import React from 'react';

import { cn } from '@/lib/utils';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([Number(e.target.value), value[1]]);
  };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([value[0], Number(e.target.value)]);
  };

  return (
    <div className={cn('flex gap-6 items-center', className ?? '')}>
      <input type="range" min={min} max={max} step={step} value={value[0]} onChange={handleChange} className="w-full" />
      <input type="range" min={min} max={max} step={step} value={value[1]} onChange={handleChange2} className="w-full" />
    </div>
  );
}
