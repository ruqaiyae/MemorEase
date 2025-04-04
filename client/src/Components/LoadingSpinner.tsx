import { motion } from 'framer-motion';

type Props = {
  width: string;
  height: string;
  text?: string;
};

export function LoadingCircleSpinner({ width, height, text }: Props) {
  return (
    <div className="flex justify-center items-center p-10">
      <div
        className="relative flex justify-center items-center"
        style={{ width, height }}>
        <motion.div
          className="absolute w-full h-full rounded-full border-[6px] border-[#654A2F] border-t-[#EBD199]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {text && (
          <span className="absolute text-[#654A2F] text-sm font-semibold">
            Loading...
          </span>
        )}
      </div>
    </div>
  );
}
