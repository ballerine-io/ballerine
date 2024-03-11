import { env } from '@/env';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

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
      .setTitle('Ballerine Backend API')
      .setDescription(
        "Ballerine's Workflows API is an open-source solution designed to democratize access to enterprise-grade risk management systems in the fintech sector. This API offers a comprehensive suite of tools for efficient workflow automation, sophisticated data management, and detailed transaction analysis. Financial institutions companies to streamline their risk operations, leveraging advanced functionalities like customizable workflow definitions, user and business data processing, and integrative transaction handling. The API facilitates a standardized, yet flexible approach to managing financial risks, ensuring scalability and adaptability. It serves as a foundational platform for fintech companies aiming to enhance their operational efficiency and compliance with evolving regulatory landscapes.",
      )
      .setVersion('1.3.10')
      .setTermsOfService('https://www.ballerine.com/terms-of-service')
      .setContact('Ballerine', 'https://ballerine.com', 'support@ballerine.com')
      .addServer('https://api-sb.eu.ballerine.com', 'Sandbox Server')
      .setBasePath('api/v1')
      .setExternalDoc('Ballerine Website', 'https://ballerine.com')
      .setExternalDoc('Ballerine API Documentation', 'https://docs.ballerine.com')
      .setExternalDoc('Ballerine Github Page', 'https://github.com/ballerine-io/ballerine')
      .addBearerAuth();

    if (env.ENVIRONMENT_NAME === 'local') {
      swaggerDocBuilder.addServer(`http://localhost:${env.PORT}`, 'Local Server');
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
    document.openapi = SWAGGER_VERSION.V3;

    // @ts-ignore
    document.webhooks = {
      workflows: {
        post: {
          requestBody: {
            description:
              'Notification for workflow-related events such as completion or state changes. Contains details about the specific workflow event.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/WorkflowEventModel',
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

  initialize(app: INestApplication, version: string = SWAGGER_VERSION.V3) {
    this._setup(app);
    this.document.openapi = version;
    return this;
  }
}

export default SwaggerSingleton.getInstance();
