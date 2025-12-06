// src/components/ui/skeleton.jsx
import React from 'react';
import { cn } from '@/lib/utils'; // If you have a utils file, otherwise omit

export const Skeleton = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse bg-gray-200 dark:bg-gray-700 rounded", className)}
      {...props}
    />
  );
};