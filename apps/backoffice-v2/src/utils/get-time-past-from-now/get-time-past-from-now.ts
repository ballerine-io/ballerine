import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getTimePastFromNow = (date: Date) =>
  dayjs(date)
    .fromNow()
    // Change 'Waiting a day ago' to 'Waiting a day'.
    .replace('ago', '');
