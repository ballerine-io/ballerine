import { serializeDocumentId } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField/helpers/serialize-document-id';

describe('serializeDocumentId', () => {
  it('will populate INDEX placeholder with index', () => {
    expect(serializeDocumentId('some-id-with-[{INDEX}]-of-document', 1)).toBe(
      'some-id-with-[index:1]-of-document',
    );
  });

  it('will not modify string if index template isnt presented', () => {
    expect(serializeDocumentId('some-id', 69)).toBe('some-id');
  });
});
