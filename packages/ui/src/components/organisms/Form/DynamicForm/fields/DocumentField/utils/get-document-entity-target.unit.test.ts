import { describe, expect, it } from 'vitest';
import { getDocumentEntityTarget } from './get-document-entity-target';

describe('getDocumentEntityTarget', () => {
  it('routes to business when metadata.businessId is present', () => {
    const target = getDocumentEntityTarget(
      { businessId: 'biz-123', entityId: 'end-user-should-be-ignored' },
      'DocumentField',
    );

    expect(target).toEqual({ entityType: 'business', entityId: 'biz-123' });
  });

  it('routes to end_user when metadata.businessId is absent', () => {
    const target = getDocumentEntityTarget(
      { entityId: 'end-user-456' },
      'useDocumentUpload',
    );

    expect(target).toEqual({ entityType: 'end_user', entityId: 'end-user-456' });
  });

  it('throws when neither metadata.businessId nor metadata.entityId is present', () => {
    expect(() => getDocumentEntityTarget({}, 'DocumentField')).toThrow(
      /metadata\.businessId.*metadata\.entityId/i,
    );
  });
});

