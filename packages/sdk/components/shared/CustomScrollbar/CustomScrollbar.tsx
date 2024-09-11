import { motion, MotionValue, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

export default function CustomScrollbar({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue;
}) {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [yPos, setYPos] = useState(
    useTransform(
      scrollYProgress,
      [0, 1],
      // @ts-ignore
      [0, scrollbarRef.current?.offsetHeight - handleRef.current?.offsetHeight]
    )
  );

  return (
    <motion.div
      className={'w-4 rounded-[5px] border border-left-accent'}
      ref={scrollbarRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
    >
      <motion.div
        ref={handleRef}
        className={'h-[20%] w-4 rounded-[5px] bg-left-accent'}
        dragElastic={0}
        dragMomentum={false}
        dragConstraints={scrollbarRef}
        style={{
          y: yPos,
        }}
      />
    </motion.div>
  );
}
