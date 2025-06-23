import DOMPurify from 'dompurify';

export const getBaseNoteContent = (status: string, text: string) => {
  const sanitizedStatus = DOMPurify.sanitize(status);
  const sanitizedText = DOMPurify.sanitize(text);

  return `
      <div class="flex flex-col">
        <span class="text-xs leading-6 text-slate-500">Status changed to <span class="font-semibold">'${sanitizedStatus}'</span>
        ${
          sanitizedText
            ? ` with details:</span><div class="text-sm">${sanitizedText}</div>`
            : '</span>'
        }
      </div>
    `;
};
