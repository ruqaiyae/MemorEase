import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  mobileWidth?: string;
  width?: string;
};

export function Container({ children, mobileWidth, width }: Props) {
  return (
    <>
      <div
        className="border-[1.5px] md:border-2 border-[#654A2F] rounded-lg mx-auto mb-8 md:mb-15 md:hidden"
        style={{ width: mobileWidth }}>
        {children}
      </div>
      <div
        className="border-[1.5px] md:border-3 border-[#654A2F] rounded-lg mx-auto mb-8 md:mb-15 hidden md:block"
        style={{ width }}>
        {children}
      </div>
    </>
  );
}
