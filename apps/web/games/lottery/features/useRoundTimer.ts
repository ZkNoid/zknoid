import { DateTime, DurationObjectUnits, Interval } from 'luxon';
import { useEffect, useState } from 'react';

const getRoundTime = (roundEndsIn: DateTime) => {
  const now = DateTime.now();

  return Interval.fromDateTimes(now, roundEndsIn)
    .toDuration(['days', 'hours', 'minutes', 'seconds'])
    .toObject();
};

export const useRoundTimer = (roundEndsIn: DateTime) => {
  const [startsIn, setStartsIn] = useState<DurationObjectUnits>(
    getRoundTime(roundEndsIn)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getRoundTime(roundEndsIn);

      setStartsIn(newTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [roundEndsIn]);

  return { startsIn };
};
