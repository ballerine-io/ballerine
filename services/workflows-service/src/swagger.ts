import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
// import { env } from './env';

export const swaggerPath = 'api';

const swaggerDocBuilder = new DocumentBuilder()
  .setTitle('Ballerine Backend API')
  .setDescription(
    "Ballerine's Workflows API is an open-source solution designed to democratize access to enterprise-grade risk management systems in the fintech sector. This API offers a comprehensive suite of tools for efficient workflow automation, sophisticated data management, and detailed transaction analysis. Financial institutions companies to streamline their risk operations, leveraging advanced functionalities like customizable workflow definitions, user and business data processing, and integrative transaction handling. The API facilitates a standardized, yet flexible approach to managing financial risks, ensuring scalability and adaptability. It serves as a foundational platform for fintech companies aiming to enhance their operational efficiency and compliance with evolving regulatory landscapes.",
  )
  .setVersion('1.3.10')
  .setTermsOfService('https://www.ballerine.com/terms-of-service')
  .setContact('Ballerine', 'https://ballerine.com', 'support@ballerine.com')
  .addServer('https:ç//api-sb.eu.ballerine.com', 'Sandbox Server')
  .setBasePath('api/v1')
  .setExternalDoc('Ballerine Website', 'https://ballerine.com')
  .setExternalDoc('Ballerine API Documentation', 'https://docs.ballerine.com')
  .setExternalDoc('Ballerine Github Page', 'https://github.com/ballerine-io/ballerine')
  .addBearerAuth();

// if (env.ENVIRONMENT_NAME === 'local') {
//   swaggerDocBuilder.addServer(`http://localhost:${env.PORT}`, 'Local Server');
// }

export const swaggerDocumentOptions = swaggerDocBuilder.build();

export const swaggerSetupOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCssUrl: '../common/swagger/swagger.css',
  customfavIcon: '../common/swagger/favicon.png',
  customSiteTitle: 'Workflow Service',
};
