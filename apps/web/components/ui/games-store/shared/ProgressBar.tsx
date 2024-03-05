import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { animate, useMotionTemplate, useTransform } from 'framer-motion';

const clamp = (number: number, min: number, max: number) => {
  return Math.max(min, Math.min(number, max));
};

export const ProgressBar = ({
  min = 0,
  max = 100,
  handleSize = 30,
  defaultValue = 0,
  title,
}: {
  min?: number;
  max?: number;
  handleSize?: number;
  defaultValue?: number;
  title: string;
}) => {
  const [value, setValue] = useState<number>(defaultValue);
  const [dragging, setDragging] = useState<boolean>(false);
  // let percent = value / (max - min);

  const constraintsRef = useRef(null);
  const handleRef = useRef(null);
  const progressBarRef = useRef(null);

  const handleX = useMotionValue(0);
  const progress = useTransform(handleX, (v) => v + handleSize / 2);
  const background = useMotionTemplate`linear-gradient(90deg, #F9F8F4 5%, #D2FF00 ${progress}px)`;

  const handleDrag = () => {
    const handleBounds = handleRef.current.getBoundingClientRect();
    const middleOfHandle = handleBounds.x + handleBounds.width / 2;
    const progressBarBounds = progressBarRef.current.getBoundingClientRect();
    const newProgress =
      (middleOfHandle - progressBarBounds.x) / progressBarBounds.width;

    setValue(newProgress * (max - min));
  };

  useEffect(() => {
    const newProgress = value / (max - min);
    const progressBarBounds = progressBarRef.current.getBoundingClientRect();

    handleX.set(newProgress * progressBarBounds.width);
  }, [handleX, max, min, value]);

  return (
    <div className="w-full pb-2">
      <div className={'py-2 text-filter'}>{title}</div>

      <div className="relative flex flex-col justify-center">
        <motion.div
          className="absolute h-3 w-full rounded-full"
          style={{ background }}
        />

        <div
          ref={progressBarRef}
          className="absolute h-2"
          style={{
            left: handleSize / 2,
            right: handleSize / 2,
          }}
        />

        <div ref={constraintsRef}>
          <motion.div
            ref={handleRef}
            className="relative z-10 rounded-full border border-bg-dark bg-left-accent shadow"
            drag="x"
            dragMomentum={false}
            dragConstraints={constraintsRef}
            dragElastic={0}
            onDrag={handleDrag}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
            onPointerDown={() => setDragging(true)}
            onPointerUp={() => setDragging(false)}
            animate={{
              scale: dragging ? 1.3 : 1,
            }}
            style={{
              width: handleSize,
              height: handleSize,
              x: handleX,
            }}
          />
        </div>

        <div
          className="absolute h-4 w-full"
          onPointerDown={(event) => {
            const { left, width } =
              progressBarRef.current.getBoundingClientRect();
            const position = event.pageX - left;
            const newProgress = clamp(position / width, 0, 1);
            const newValue = newProgress * (max - min);
            setValue(newValue, min, max);
            animate(handleX, newProgress * width);
          }}
        />
      </div>

      <div className={'mt-4 flex flex-row justify-between'}>
        <motion.input
          type="text"
          placeholder={'from'}
          className={
            'max-w-[100px] rounded-[5px] border bg-bg-dark p-1 placeholder:font-plexsans placeholder:text-main hover:placeholder:text-left-accent/80 focus:outline-none'
          }
          // animate={{ y: dragging && percent < 0.4 ? 20 : 0 }}
        />
        <motion.input
          type="text"
          placeholder={'to'}
          value={Math.round(Math.floor(value * 100) / 100)}
          max={max}
          min={min}
          className={
            'max-w-[100px] rounded-[5px] border bg-bg-dark p-1 placeholder:font-plexsans placeholder:text-main hover:placeholder:text-left-accent/80 focus:outline-none'
          }
          // animate={{ y: dragging && percent > 0.6 ? 20 : 0 }}
          onChange={(event) => {
            if (event.target.value < max && event.target.value >= min)
              setValue(event.target.value);
          }}
        />
      </div>
    </div>
  );
};
