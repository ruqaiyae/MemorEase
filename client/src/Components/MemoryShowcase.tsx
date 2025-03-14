import { CSSProperties } from 'react';

type TileProps = {
  src: string;
  alt: string;
};

export function MemoryTile({ src, alt }: TileProps) {
  return (
    <>
      <div className="flex justify-center w-[40%]">
        <img src={src} alt={alt} className="w-[90%] md:w-[80%]" />
      </div>
    </>
  );
}

type DescriptionProps = {
  title: string;
  text: string;
  textAlign?: CSSProperties['textAlign'];
};

export function MemoryDescription({
  title,
  text,
  textAlign,
}: DescriptionProps) {
  return (
    <div className="w-[60%] flex content-center flex-wrap">
      <div className="text-[#654A2F]" style={{ textAlign }}>
        <h4 className="font-[fondamento] md:text-[40px]">{title}</h4>
        <p className="font-[artifika] text-[8px] md:text-[20px] whitespace-pre-line">
          {text}
        </p>
      </div>
    </div>
  );
}
