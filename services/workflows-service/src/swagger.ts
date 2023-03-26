import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerPath = 'api';

export const swaggerDocumentOptions = new DocumentBuilder()
  .setTitle('Workflow API Service')
  .setDescription(
    'Workflow API Service',
  )
  .setVersion('20')
  .addBearerAuth()
  .build();

export const swaggerSetupOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCssUrl: '../swagger/swagger.css',
  customfavIcon: '../swagger/favicon.png',
  customSiteTitle: 'Sample service',
};
