import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  width?: string;
};

export function Container({ children, width }: Props) {
  return (
    <>
      <div className="border-[1.5px] md:border-2 border-[#654A2F] rounded-lg mx-auto mb-8 md:mb-15 w-[60%] md:hidden">
        {children}
      </div>
      <div
        className="border-[1.5px] md:border-2 border-[#654A2F] rounded-lg mx-auto mb-8 md:mb-15 hidden md:block"
        style={{ width }}>
        {children}
      </div>
    </>
  );
}
