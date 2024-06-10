import { useState } from 'react';
import Lottie from 'react-lottie';

export default function AnimatedThimble({
  animation,
  onAnimationEnded,
}: {
  animation: any;
  onAnimationEnded: () => void;
}) {
  const [animationEnded, setAnimationEnded] = useState(false);
  return (
    <Lottie
      style={{}}
      options={{
        loop: false,
        animationData: animation,
      }}
      isPaused={animationEnded}
      eventListeners={[
        {
          eventName: 'enterFrame',
          callback: ((e: any) => {
            if (e.currentTime > e.totalTime / 2) {
              setAnimationEnded(true);
              onAnimationEnded();
            }
          }) as any,
        },
      ]}
    />
  );
}
