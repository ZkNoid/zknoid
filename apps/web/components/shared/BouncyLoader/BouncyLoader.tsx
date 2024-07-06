import { motion } from 'framer-motion';

export default function BouncyLoader({
  colors = ['#D2FF00', '#DCB8FF', '#FF5B23'],
}: {
  colors?: [string, string, string];
}) {
  return (
    <div className={'flex flex-row gap-[0.5vw]'}>
      <motion.div
        className={'h-[1vw] w-[1vw] rounded-[0.26vw]'}
        style={{ backgroundColor: colors[0] }}
        animate={{
          y: '-100%',
          scaleY: 0.8,
          transition: {
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.7,
            stiffness: 1000,
            damping: 50,
            duration: 0.6,
          },
        }}
      />
      <motion.div
        className={'h-[1vw] w-[1vw] rounded-[0.26vw]'}
        style={{ backgroundColor: colors[1] }}
        animate={{
          y: '-100%',
          scaleY: 0.8,
          transition: {
            repeat: Infinity,
            repeatType: 'reverse',
            stiffness: 1000,
            damping: 50,
            duration: 0.6,
          },
        }}
      />
      <motion.div
        className={'h-[1vw] w-[1vw] rounded-[0.26vw]'}
        style={{ backgroundColor: colors[2] }}
        animate={{
          y: '-100%',
          scaleY: 0.8,
          transition: {
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.4,
            stiffness: 1000,
            damping: 50,
            duration: 0.6,
          },
        }}
      />
    </div>
  );
}
