import '@testing-library/jest-dom';

// Mock window and document
global.document = {} as Document;
global.window = {} as Window & typeof globalThis;
