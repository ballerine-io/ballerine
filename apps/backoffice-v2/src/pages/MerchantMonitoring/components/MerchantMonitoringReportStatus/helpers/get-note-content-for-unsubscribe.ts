import { toStartCase } from '@/common/utils/to-start-case/to-start-case';

export const getNoteContentForUnsubscribe = (status: string, text: string) => `
  <div class="flex flex-col">
    <span class="text-xs leading-6 text-slate-500">
      Status changed to <span class="font-semibold">"${toStartCase(
        status,
      )},"</span> and the merchant was <b>unsubscribed from ongoing monitoring</b>
      ${text ? ` with details:</span><div class="text-sm">${text}</div>` : '</span>'}
  </div>
`;
