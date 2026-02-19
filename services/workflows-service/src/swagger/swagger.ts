import { env } from '@/env';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { defaultContextSchema } from '@ballerine/common';

export const swaggerPath = 'api';

export const SWAGGER_VERSION = {
  V3: '3.0.0',
  V3_1: '3.1.0',
};

class SwaggerSingleton {
  private static instance: SwaggerSingleton;
  public document: any;

  public static getInstance(): SwaggerSingleton {
    if (!SwaggerSingleton.instance) {
      SwaggerSingleton.instance = new SwaggerSingleton();
    }

    return SwaggerSingleton.instance;
  }

  private _setup(app: INestApplication) {
    if (this.document) {
      throw new Error('Swagger has already been initialized');
    }

    const swaggerDocBuilder = new DocumentBuilder()
      .setTitle('MiKashBoks Identity Workflows API')
      .setDescription(
        "MiKashBoks Identity Workflows API provides KYC/KYB verification workflow orchestration, case management, and decision automation for West African financial services. Built on top of the Ballerine open-source workflow engine.",
      )
      .setVersion('1.3.10')
      .setContact('MiKashBoks', 'https://mikashboks.com', 'support@mikashboks.com')
      .setBasePath('api/v1')
      .setExternalDoc('MiKashBoks Documentation', 'https://mikashboks.com')
      .addBearerAuth();

    if (env.ENVIRONMENT_NAME === 'local') {
      swaggerDocBuilder.addServer(`http://localhost:${env.PORT}`, 'Local Server');
      swaggerDocBuilder.addServer(`https://api.verify-dev.mikashboksapis.com`, 'Development Server');
    }

    if (env.ENVIRONMENT_NAME === 'development') {
      swaggerDocBuilder.addServer(`https://api.verify-dev.mikashboksapis.com`, 'Development Server');
    }

    if (env.ENVIRONMENT_NAME === 'production') {
      swaggerDocBuilder.addServer(`https://api.verify.mikashboksapis.com`, 'Production Server');
    }

    const swaggerDocumentOptions = swaggerDocBuilder.build();

    const swaggerSetupOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customCssUrl: '../common/swagger/swagger.css',
      customfavIcon: '../common/swagger/favicon.png',
      customSiteTitle: 'Workflow Service',
    };

    const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

    /** check if there is Public decorator for each path (action) and its method (findMany / findOne) on each controller */
    Object.values(document.paths).forEach((path: PathItemObject) => {
      Object.values(path).forEach((method: { security: string[] | unknown }) => {
        if (Array.isArray(method.security) && method.security.includes('isPublic')) {
          method.security = [];
        }
      });
    });
    document.openapi = SWAGGER_VERSION.V3_1;

    // @ts-ignore
    document.webhooks = {
      workflows: {
        post: {
          requestBody: {
            description:
              'Webhooks notify clients about workflow events asynchronously. Events include creation, start, completion, failure, and context updates of workflows. Webhook payloads contain information like event ID, name, API version, timestamps, workflow IDs, status, final state, Ballerine entity ID, correlation ID, and environment. Additional data varies by workflow type and checks. Clients must configure an endpoint to receive POST requests with webhook notifications and verify requests using HMAC signatures for security.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'Unique identifier of the workflow event.',
                    },
                    eventName: {
                      type: 'string',
                      description: 'Name of the workflow event.',
                      enum: [
                        'workflow.completed',
                        'workflow.state.changed',
                        'workflow.context.changed',
                        'workflow.created',
                        'workflow.resolved',
                        'workflow.started',
                        'workflow.failed',
                        'workflow.resumed',
                        'workflow.cancelled',
                      ],
                      example: 'workflow.completed',
                    },
                    apiVersion: {
                      type: 'string',
                      description: 'API version of the workflow event.',
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Timestamp of when the workflow event occurred.',
                    },
                    workflowCreatedAt: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Timestamp of when the workflow was created.',
                    },
                    workflowResolvedAt: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Timestamp of when the workflow was resolved.',
                    },
                    workflowDefinitionId: {
                      type: 'string',
                      description: 'Unique identifier of the workflow definition.',
                    },
                    workflowRuntimeId: {
                      type: 'string',
                      description: 'Unique identifier of the workflow runtime data.',
                    },
                    workflowStatus: {
                      type: 'string',
                      description: 'Status of the workflow, e.g., "completed" or "failed".',
                    },
                    workflowFinalState: {
                      type: 'string',
                      description: 'Final state of the workflow.',
                      oneOf: [{ enum: ['approved', 'rejected', 'failed'] }, { type: 'string' }],
                    },
                    ballerineEntityId: {
                      type: 'string',
                      description: 'Unique identifier of the associated Ballerine entity.',
                    },
                    correlationId: {
                      type: 'string',
                      description: 'Correlation ID for tracking the workflow event.',
                    },
                    environment: {
                      type: 'string',
                      description: 'Environment in which the workflow event occurred.',
                    },
                    data: defaultContextSchema,
                  },
                  required: [
                    'id',
                    'eventName',
                    'apiVersion',
                    'timestamp',
                    'workflowCreatedAt',
                    'workflowResolvedAt',
                    'workflowDefinitionId',
                    'workflowRuntimeId',
                    'workflowStatus',
                    'workflowFinalState',
                    'ballerineEntityId',
                    'correlationId',
                    'environment',
                    'data',
                  ],
                },
              },
            },
          },
          responses: {
            '200': {
              description:
                'A 200 status indicates successful receipt of the workflow event notification.',
            },
          },
        },
        security: [
          {
            hmacAuth: [],
          },
        ],
        description:
          'This endpoint uses HMAC signature authentication to ensure the integrity and authenticity of the webhook payload. The HMAC signature is generated using a shared secret key and is included in the "X-HMAC-Signature" header of the request. The receiving party can verify the signature by recomputing the HMAC using the shared secret key and comparing it with the received signature. This authentication mechanism ensures that the webhook payload originated from a trusted source and has not been tampered with during transmission.',
      },
      alerts: {
        post: {
          requestBody: {
            description:
              'Alert notification containing details about specific alert incidents, including the alert ID and relevant information.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AlertModel',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'A 200 status confirms successful receipt of the alert notification.',
            },
          },
        },
      },
    };

    this.document = document;

    SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);
  }

  initialize(app: INestApplication, version: string = SWAGGER_VERSION.V3_1) {
    this._setup(app);
    this.document.openapi = version;

    return this;
  }
}

export default SwaggerSingleton.getInstance();
