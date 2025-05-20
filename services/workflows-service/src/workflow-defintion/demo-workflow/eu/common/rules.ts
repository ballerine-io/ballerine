export const HIDE_IF_COUNTRY_IS_NOT_US_AE_OR_CA = {
  engine: 'json-logic',
  value: {
    '!': {
      in: [{ var: 'entity.data.country' }, ['AE', 'US', 'CA']],
    },
  },
};

export const VALIDATE_IF_COUNTRY_IS_US_AE_OR_CA = {
  engine: 'json-logic',
  value: {
    in: [{ var: 'entity.data.country' }, ['AE', 'US', 'CA']],
  },
};

export const DISABLE_IF_OCR_IS_RUNNING = {
  engine: 'json-logic',
  value: {
    '==': [{ var: '_plugins.fetch_company_information.status' }, 'running'],
  },
};

export const DISABLE_IF_APP_SYNCING = {
  engine: 'json-logic',
  value: {
    '==': [{ var: '_appState.isSyncing' }, true],
  },
};

export const SHOULD_DISPATCH_OPEN_CORPORATE_RULE = {
  engine: 'json-schema',
  value: {
    type: 'object',
    properties: {
      entity: {
        type: 'object',
        required: ['data'],
        default: {},
        properties: {
          data: {
            type: 'object',
            required: ['registrationNumber', 'country'],
            default: {},
            properties: {
              registrationNumber: {
                type: 'string',
                minLength: 4,
                maxLength: 20,
              },
              country: {
                type: 'string',
                minLength: 2,
                maxLength: 2,
              },
              additionalInfo: {
                type: 'object',
                properties: {
                  state: {
                    type: 'string',
                    minLength: 1,
                  },
                },
              },
            },
            if: {
              properties: {
                country: {
                  enum: ['AE', 'US', 'CA'],
                },
              },
            },
            then: {
              required: ['additionalInfo'],
              properties: {
                additionalInfo: {
                  required: ['state'],
                },
              },
            },
          },
        },
      },
    },
    required: ['entity'],
  },
};

export const HIDE_IF_MCC_IS_NOT_CANNABIS_RELATED = {
  engine: 'json-logic',
  value: {
    '!': {
      or: [
        { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '5499'] },
        { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '5912'] },
        { '==': [{ var: '$this.document.status' }, 'requested'] },
      ],
    },
  },
};

export const VALIDATE_IF_MCC_IS_CANNABIS_RELATED = {
  engine: 'json-logic',
  value: {
    or: [
      { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '5499'] },
      { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '5912'] },
      { '==': [{ var: '$this.document.status' }, 'requested'] },
    ],
  },
};

export const HIDE_IF_MCC_NOT_GAMBLING_RELATED = {
  engine: 'json-logic',
  value: {
    '!': {
      or: [
        { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '7801'] },
        { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '7800'] },
        { '==': [{ var: '$this.document.status' }, 'requested'] },
      ],
    },
  },
};

export const VALIDATE_IF_MCC_IS_GAMBLING_RELATED = {
  engine: 'json-logic',
  value: {
    or: [
      { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '7801'] },
      { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '7800'] },
      { '==': [{ var: '$this.document.status' }, 'requested'] },
    ],
  },
};

export const HIDE_IF_MCC_NOT_FIREARMS_RELATED = {
  engine: 'json-logic',
  value: {
    '!': {
      or: [
        { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '5941'] },
        { '==': [{ var: '$this.document.status' }, 'requested'] },
      ],
    },
  },
};

export const VALIDATE_IF_MCC_IS_FIREARMS_RELATED = {
  engine: 'json-logic',
  value: {
    or: [
      { '==': [{ var: 'entity.data.additionalInfo.mcc' }, '5941'] },
      { '==': [{ var: '$this.document.status' }, 'requested'] },
    ],
  },
};
