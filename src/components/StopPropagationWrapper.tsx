"use client";

import { ReactNode } from 'react'

const StopPropagationWrapper = ({ children }: {children: ReactNode}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
	};

  return (
    <div onClick={handleClick}>{children}</div>
  );
}

export default StopPropagationWrapper;