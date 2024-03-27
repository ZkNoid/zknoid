import { motion } from 'framer-motion';

export const LoadSpinner = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  return (
    <div className={'relative'} style={{ width: width, height: height }}>
      <motion.span
        className={
          'absolute left-0 top-0 box-border block rounded-[50%] border-[7px] border-solid border-[#252525] border-t-left-accent'
        }
        style={{ width: width, height: height }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: 'easeInOut',
          duration: 1,
        }}
      />
    </div>
  );
};
