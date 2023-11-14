import { DocumentValueDestinationParser } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField/helpers/document-value-destination-parser';

describe('DocumentValueDestinationParser', () => {
  describe('.extractRootPath', () => {
    describe('when path is valid', () => {
      describe.each([
        ['some.root.path.documents[0].pages[0]', 'some.root.path.documents'],
        ['documents[0].pages[0]', 'documents'],
      ])('will extract root path from %s', (input, expected) => {
        test(`returns ${expected}`, () => {
          const parser = new DocumentValueDestinationParser(input);

          expect(parser.extractRootPath()).toBe(expected);
        });
      });
    });

    describe('otherwise', () => {
      it('will be null', () => {
        const parser = new DocumentValueDestinationParser(
          'some.random.broken.path[3433434].test.99.1221',
        );

        expect(parser.extractRootPath()).toBe(null);
      });
    });
  });

  describe('.extractPagePath', () => {
    describe('when path is valid', () => {
      it('will extract path to document page', () => {
        const parser = new DocumentValueDestinationParser(
          'some.path.to.documents[0].page.nested.pages[1].file.id',
        );

        expect(parser.extractPagePath()).toBe('page.nested.pages[1]');
      });
    });

    describe('otherwise', () => {
      it('will be null', () => {
        const parser = new DocumentValueDestinationParser('brokenpath');

        expect(parser.extractPagePath()).toBe(null);
      });
    });
  });

  describe('.extractFileIdPath', () => {
    describe('when path is valid', () => {
      it('will extract path to fileId', () => {
        const parser = new DocumentValueDestinationParser(
          'context.documents[1].additionalInfo.pages[0].path.to.file.id',
        );

        expect(parser.extractFileIdPath()).toBe('path.to.file.id');
      });
    });

    describe('otherwise', () => {
      it('will be null', () => {
        const parser = new DocumentValueDestinationParser('some-broken.path-pages[1121]');

        expect(parser.extractFileIdPath()).toBe(null);
      });
    });
  });
});
