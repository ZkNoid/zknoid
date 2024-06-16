import { DateTime, DurationObjectUnits, Interval } from "luxon";
import { useEffect, useState } from "react";

const getRoundTime = () => {
  const now = DateTime.now();

  return Interval.fromDateTimes(now, DateTime.now().endOf('day'))
    .toDuration(['days', 'hours', 'minutes', 'seconds'])
    .toObject();
};

export const useRoundTimer = () => {
  const [startsIn, setStartsIn] = useState<DurationObjectUnits>(
    getRoundTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getRoundTime();

      setStartsIn(newTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [event]);

  return { startsIn };
};
