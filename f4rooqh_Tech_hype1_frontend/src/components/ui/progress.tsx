'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value: number;
}

export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div className={cn("relative w-full h-full flex items-center", className)}>
      <ProgressPrimitive.Root
        {...props}
        className="relative h-full w-full overflow-hidden rounded-full bg-[#1F2227] border border-white/10"
      >
        {/* Filled Bar */}
        <ProgressPrimitive.Indicator
          className="h-full bg-[#00A34A] transition-all duration-500 ease-in-out"
          style={{ width: `${value || 0}%` }}
        />
      </ProgressPrimitive.Root>

      {/* Dot Indicator */}
      <div
        className="absolute top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 rounded-full bg-[#00A34A] border-[3px] border-white shadow-lg transition-all duration-500 ease-in-out"
        style={{ left: `calc(${value || 0}% - 10px)` }}
      />
    </div>
  );
}
