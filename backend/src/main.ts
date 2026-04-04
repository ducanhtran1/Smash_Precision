import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:4173',
      'http://127.0.0.1:4173',
    ],
    credentials: true,
  });
  app.setGlobalPrefix('api');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Smash Precision API')
    .setDescription(
      'The Smash Precision e-commerce and inventory API documentation',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger will be available at /api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap().catch((err: unknown) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});
