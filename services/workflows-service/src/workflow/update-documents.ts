import { DefaultContextSchema } from '@/workflow/schemas/context';
import { PartialDeep } from 'type-fest';

type Documents = DefaultContextSchema['documents'];
type Document = Documents[number];

export function updateDocuments(
  documents: Documents,
  documentsToUpdate: PartialDeep<Documents>,
): Documents {}
