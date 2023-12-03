import { convertMsDurationToTime } from '@/common/utils/convert-ms-duration-to-time/convert-ms-duration-to-time';
import { memo, useMemo } from 'react';

interface Props {
  duration: number;
}

export const DurationCardContent = memo(({ duration }: Props) => {
  const time = useMemo(() => {
    const normalizedDuration = Math.abs(duration);
    const time = convertMsDurationToTime(normalizedDuration);
    const stringifiedTime: Record<string, string> = {};

    // converting time values to two-digit format when needed
    Object.entries(time).forEach(([key, value]) => {
      stringifiedTime[key] = value < 10 ? `0${value}` : String(value);
    });

    return stringifiedTime;
  }, [duration]);

  return <>{`${time.days ? `${time.days}:` : ''}${time.hours}:${time.minutes}:${time.seconds}`}</>;
});
