import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

NestFactory.create(AppModule).then((app) => {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setExternalDoc(
        'GraphQL API described here (use "Docs" and "Schema" tags on the right side)',
        '/graphql',
      )
      .setTitle('Soum test assessment #0')
      .setDescription('This doc describes the REST API endpoints')
      .setVersion(null)
      .build(),
  );

  SwaggerModule.setup('apidocs', app, document);

  app.useGlobalPipes(new ValidationPipe({}));

  app.listen(3000);
});
