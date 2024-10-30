import { DefaultContextSchema } from '@/schemas';
import { describe, expect, it, test } from 'vitest';
import { CollectionFlowManager } from './collection-flow-manager';
import { ConfigHelper } from './helpers/config-helper';
import { StateHelper } from './helpers/state-helper';

describe('CollectionFlowManager', () => {
  it('should be defined', () => {
    expect(new CollectionFlowManager({} as DefaultContextSchema)).toBeDefined();
  });

  it('will fail to initialize with invalid config', () => {
    expect(() => new CollectionFlowManager({} as DefaultContextSchema, {} as any)).toThrow(
      'Invalid collection flow manager config.',
    );
  });

  describe('start of collection flow will fail', () => {
    test('collection flow is already started', () => {
      const collectionFlowManager = new CollectionFlowManager({
        collectionFlow: {
          state: {
            uiState: 'step1',
          },
        },
      } as DefaultContextSchema);

      expect(() => collectionFlowManager.initializeCollectionFlowContext()).toThrow(
        'Collection flow already started.',
      );
    });
  });

  describe('collection flow is considered started', () => {
    test('when uiState is set', () => {
      const collectionFlowManager = new CollectionFlowManager({
        collectionFlow: { state: { uiState: 'step1' } },
      } as DefaultContextSchema);

      expect(collectionFlowManager.isStarted()).toBe(true);
    });
  });

  describe('context will be updated on start', () => {
    test('config is provided', () => {
      const collectionFlowManager = new CollectionFlowManager({} as DefaultContextSchema, {
        apiUrl: 'https://api.example.com',
        steps: [{ stateName: 'step1', orderNumber: 1 }],
      });

      const context = collectionFlowManager.initializeCollectionFlowContext();

      expect(context).toBeDefined();
      expect(context.collectionFlow?.config?.apiUrl).toBe('https://api.example.com');
      expect(context.collectionFlow?.state?.progress).toEqual({
        step1: {
          isCompleted: false,
        },
      });
    });

    test('input context wont be mutated', () => {
      const inputContext = {} as DefaultContextSchema;

      const collectionFlowManager = new CollectionFlowManager(inputContext, {
        apiUrl: 'https://api.example.com',
        steps: [{ stateName: 'step1', orderNumber: 1 }],
      });

      collectionFlowManager.initializeCollectionFlowContext();

      expect(inputContext).not.to.be.equal(collectionFlowManager.context);
    });
  });

  describe('start of collection flow will succeed', () => {
    test('config is provided', () => {
      const collectionFlowManager = new CollectionFlowManager({} as DefaultContextSchema, {
        apiUrl: 'https://api.example.com',
        steps: [{ stateName: 'step1', orderNumber: 1 }],
      });

      const context = collectionFlowManager.initializeCollectionFlowContext();

      expect(context).toBeDefined();
    });
  });

  describe('retrieving config', () => {
    describe('will fail', () => {
      test('when config is not set', () => {
        const collectionFlowManager = new CollectionFlowManager({} as DefaultContextSchema);

        expect(() => collectionFlowManager.config()).toThrow(
          'Collection flow manager config is not set.',
        );
      });
    });

    describe('will succeed', () => {
      test('config is provided', () => {
        const notStartedCollectionFlowManager = new CollectionFlowManager(
          {} as DefaultContextSchema,
          {
            apiUrl: 'https://api.example.com',
            steps: [{ stateName: 'step1', orderNumber: 1 }],
          },
        );

        const ctx = notStartedCollectionFlowManager.initializeCollectionFlowContext();

        const startedCollectionFlowManager = new CollectionFlowManager(ctx);

        const config = startedCollectionFlowManager.config();

        expect(config).toBeDefined();
        expect(config).toBeInstanceOf(ConfigHelper);
      });
    });
  });

  describe('retrieving state', () => {
    describe('will fail', () => {
      test('when state is not set', () => {
        const collectionFlowManager = new CollectionFlowManager({} as DefaultContextSchema);

        expect(() => collectionFlowManager.state()).toThrow(
          'Collection flow manager state is not set.',
        );
      });
    });

    describe('will succeed', () => {
      test('state is set', () => {
        const notStartedCollectionFlowManager = new CollectionFlowManager(
          {} as DefaultContextSchema,
          {
            apiUrl: 'https://api.example.com',
            steps: [{ stateName: 'step1', orderNumber: 1 }],
          },
        );

        const ctx = notStartedCollectionFlowManager.initializeCollectionFlowContext();

        const startedCollectionFlowManager = new CollectionFlowManager(ctx);

        const state = startedCollectionFlowManager.state();

        expect(state).toBeDefined();
        expect(state).toBeInstanceOf(StateHelper);
      });
    });
  });
});
