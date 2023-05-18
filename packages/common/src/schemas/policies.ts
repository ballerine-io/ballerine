const fileTypeSchema = {
  type: 'object',
  properties: {
    fileType: { type: 'string' },
  },
  required: ['fileType'],
};

const kycRulesSchema = {
  type: 'object',
  properties: {
    faceMatch: { type: 'object', properties: { $eq: { type: 'boolean' } } },
    idDocApproved: { type: 'object', properties: { $eq: { type: 'boolean' } } },
    'user.age': { type: 'object', properties: { $gte: { type: 'integer' } } },
  },
  required: ['faceMatch', 'idDocApproved', 'user.age'],
};

const kycTaskSchema = {
  type: 'object',
  properties: {
    kyc: {
      type: 'object',
      properties: {
        files: { type: 'array', items: fileTypeSchema },
        fields: { type: 'array', items: { type: 'string' } },
        decisions: {
          type: 'object',
          properties: {
            faceMatch: { type: 'boolean' },
            idDocApproved: { type: 'boolean' },
          },
          required: ['faceMatch', 'idDocApproved'],
        },
        rules: { type: 'array', items: kycRulesSchema },
      },
      required: ['files', 'fields', 'decisions', 'rules'],
    },
  },
};

const coiTaskSchema = {
  type: 'object',
  properties: {
    certificateOfIncorporation: {
      type: 'object',
      properties: {
        files: { type: 'array', items: fileTypeSchema },
        decisions: {
          type: 'object',
          properties: {
            coiApproved: { type: 'boolean' },
          },
          required: ['coiApproved'],
        },
        rules: { type: 'array' }, // Add schema for rules if needed
      },
      required: ['files', 'decisions', 'rules'],
    },
  },
};

const rulesSetSchema = {
  type: 'object',
  properties: {
    rules: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          idDocApproved: { type: 'object', properties: { $eq: { type: 'boolean' } } },
          coiApproved: { type: 'object', properties: { $eq: { type: 'boolean' } } },
          faceMatch: { type: 'object', properties: { $eq: { type: 'boolean' } } },
          'user.age': { type: 'object', properties: { $gte: { type: 'integer' } } },
        },
      },
    },
    result: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        fidoScore: { type: 'string' },
      },
      required: ['status', 'riskScore'],
    },
  },
  required: ['rules', 'result'],
};

const kybPolicySchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    name: { type: 'string' },
    version: { type: 'integer' },
    tasks: {
      type: 'array',
      items: {
        anyOf: [kycTaskSchema, coiTaskSchema],
      },
    },
    rulesSets: {
      type: 'array',
      items: rulesSetSchema,
    },
  },
};
