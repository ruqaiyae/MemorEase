import { ReactNode } from 'react';

type Props = {
  marginLeft: string;
  marginRight: string;
  text: string;
  isLoading: boolean;
  children: ReactNode;
};

export function MemoryContainer({
  marginLeft,
  marginRight,
  text,
  isLoading,
  children,
}: Props) {
  return (
    <>
      <h1
        className="font-[fondamento] font-bold text-[#654A2F] text-[15px] md:text-[40px] text-center my-3 md:my-10"
        style={{ marginLeft, marginRight }}>
        {text}
      </h1>
      <div className="mx-auto mb-8 md:mb-15">
        {isLoading && (
          <p className="font-[artifika] text-[#654A2F] text-center text-[10px] md:text-[25px] mx-5 my-10 md:mt-20">
            Loading...
          </p>
        )}
        {children}
      </div>
    </>
  );
}
