import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerPath = 'api';

export const swaggerDocumentOptions = new DocumentBuilder()
  .setTitle('Workflows API Service')
  .setDescription('Workflows API Service')
  .setVersion('1')
  .addBearerAuth()
  .build();

export const swaggerSetupOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCssUrl: '../common/swagger/swagger.css',
  customfavIcon: '../common/swagger/favicon.png',
  customSiteTitle: 'Workflow Service',
};
