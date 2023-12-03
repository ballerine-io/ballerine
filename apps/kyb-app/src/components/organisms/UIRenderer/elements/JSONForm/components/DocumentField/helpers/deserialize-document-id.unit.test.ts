import { deserializeDocumentId } from '@/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField/helpers/serialize-document-id';

describe('deserializeDocumentId', () => {
  it('will return origin documentId template', () => {
    expect(deserializeDocumentId('some-document[index:1]')).toBe('some-document[{INDEX}]');
  });

  it('will return same string when format is not valid', () => {
    expect(deserializeDocumentId('some-document[NOTVALID:1]')).toBe('some-document[NOTVALID:1]');
  });
});
